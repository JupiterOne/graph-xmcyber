import fetch, { RequestInit, Response as NodeFetchResponse } from 'node-fetch';
import { URLSearchParams } from 'url';
import { retry, sleep } from '@lifeomic/attempt';

import {
  IntegrationError,
  IntegrationLogger,
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
  IntegrationProviderAuthorizationError,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from './config';
import {
  Method,
  RateLimitStatus,
  XMCyberEntitiesResponse,
  XMCyberEntity,
} from './types';

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;
export interface XMCyberResponse<T> extends NodeFetchResponse {
  json(): Promise<T>;
}

/**
 * default: 100, max: 1000
 */
const ITEMS_PER_PAGE = 1000;

export class XMCyberClient {
  private readonly headers: RequestInit['headers'];
  private readonly BASE_URL = 'https://cyberrange.clients.xmcyber.com/api';
  private rateLimitStatus: RateLimitStatus;

  constructor(
    readonly config: IntegrationConfig,
    readonly logger: IntegrationLogger,
  ) {
    const { apiKey } = config;
    this.headers = {
      'Content-type': 'application/json',
      Accept: 'application/json',
      'X-Api-Key': apiKey,
    };
  }

  public async iterateEntities(iteratee: ResourceIteratee<XMCyberEntity>) {
    let page = 1,
      currentPage = 1,
      totalPages = 0;

    do {
      const response = await this.fetchEntities(page, ITEMS_PER_PAGE);
      const result = await response.json();

      totalPages = result.paging.totalPages;
      currentPage = Number(result.paging.page);

      if (Array.isArray(result.data)) {
        for (const resource of result.data) {
          await iteratee(resource);
        }
      } else {
        throw new IntegrationError({
          code: 'UNEXPECTED_RESPONSE_DATA',
          message: `Expected a collection of resources but type was ${typeof result}`,
        });
      }

      page = totalPages > currentPage ? currentPage + 1 : 0; // 0 stops pagination
    } while (page);
  }

  public async verifyAuthentication(): Promise<void> {
    // This endpoint will throw 401 when the request lacks valid authentication credentials
    const endpoint = '/status/systemHealth';
    try {
      await this.request<void>(endpoint, Method.GET);
    } catch (err) {
      throw new IntegrationProviderAuthenticationError({
        cause: err,
        endpoint: this.BASE_URL + endpoint,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  private async fetchEntities(page: number, pageSize: number) {
    const searchParams = new URLSearchParams({
      page: page.toString(),
      pageSize: ITEMS_PER_PAGE.toString(),
    });
    const endpoint = `/systemReport/entities?${searchParams.toString()}`;

    return this.request<XMCyberEntitiesResponse>(endpoint, Method.GET);
  }

  /**
   * Pulls rate limit headers from response.
   * Note: Check recordings to see rate limit headers.
   * @param response
   * @private
   */
  private setRateLimitStatus<T>(response: XMCyberResponse<T>) {
    const limit = response.headers.get('X-RateLimit-Limit');
    const remaining = response.headers.get('X-RateLimit-Remaining');
    const reset = response.headers.get('X-RateLimit-Reset');

    if (limit && remaining && reset) {
      this.rateLimitStatus = {
        limit: Number(limit),
        remaining: Number(remaining),
        reset: Number(reset),
      };
    }

    this.logger.info(this.rateLimitStatus, 'Rate limit status.');
  }

  /**
   * Determines if approaching the rate limit, sleeps until rate limit has reset.
   */
  private async checkRateLimitStatus() {
    if (this.rateLimitStatus) {
      const rateLimitRemainingProportion =
        this.rateLimitStatus.remaining / this.rateLimitStatus.limit;
      const msUntilRateLimitReset = this.rateLimitStatus.reset - Date.now();

      if (rateLimitRemainingProportion <= 0.1 && msUntilRateLimitReset > 0) {
        this.logger.info(
          {
            rateLimitStatus: this.rateLimitStatus,
            msUntilRateLimitReset,
            rateLimitRemainingProportion,
          },
          `Reached rate limits, sleeping now.`,
        );
        await sleep(msUntilRateLimitReset);
      }
    }
  }

  private async request<T>(
    endpoint: string,
    method: Method,
    body?: {},
  ): Promise<XMCyberResponse<T>> {
    const requestAttempt = async () => {
      await this.checkRateLimitStatus();
      const requestOptions: RequestInit = {
        method,
        headers: this.headers,
      };
      if (body) {
        requestOptions.body = JSON.stringify(body);
      }

      const response: XMCyberResponse<T> = (await fetch(
        this.BASE_URL + endpoint,
        requestOptions,
      )) as XMCyberResponse<T>;

      if (response.status === 401) {
        throw new IntegrationProviderAuthenticationError({
          endpoint,
          status: response.status,
          statusText: response.statusText,
        });
      } else if (response.status === 403) {
        throw new IntegrationProviderAuthorizationError({
          endpoint,
          status: response.status,
          statusText: response.statusText,
        });
      } else if (!response.ok) {
        throw new IntegrationProviderAPIError({
          endpoint,
          status: response.status,
          statusText: response.statusText,
        });
      } else if (response.status === 200) {
        // Rate limit headers are responded only in 200
        this.setRateLimitStatus(response);
      }

      return response;
    };

    return await retry(requestAttempt, {
      maxAttempts: 3,
      delay: 30_000,
      timeout: 180_000,
      factor: 2,
      handleError: (error, attemptContext) => {
        if ([401, 403, 404].includes(error.status)) {
          attemptContext.abort();
        }

        if (attemptContext.aborted) {
          this.logger.warn(
            { attemptContext, error, endpoint },
            'Hit an unrecoverable error from API Provider. Aborting.',
          );
        } else {
          this.logger.warn(
            { attemptContext, error, endpoint },
            `Hit a possibly recoverable error from API Provider. Waiting before trying again.`,
          );
        }
      },
    });
  }
}

export function createXMCyberClient(
  config: IntegrationConfig,
  logger: IntegrationLogger,
): XMCyberClient {
  return new XMCyberClient(config, logger);
}
