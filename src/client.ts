import fetch, { RequestInit, Response as NodeFetchResponse } from 'node-fetch';
import { URLSearchParams } from 'url';

import {
  IntegrationError,
  IntegrationLogger,
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
  IntegrationProviderAuthorizationError,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from './config';
import { Method, XMCyberEntity } from './types';

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;
export interface XMCyberResponse<T> extends NodeFetchResponse {
  json(): Promise<T>;
}

/**
 * default: 100, max: 1000
 */
const ITEMS_PER_PAGE = 1000;

/**
 * An APIClient maintains authentication state and provides an interface to
 * third party data APIs.
 *
 * It is recommended that integrations wrap provider data APIs to provide a
 * place to handle error responses and implement common patterns for iterating
 * resources.
 */
export class APIClient {
  private readonly headers: RequestInit['headers'];
  private BASE_URL = 'https://cyberrange.clients.xmcyber.com/api';

  // TODO: Use logger and use config
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

  // TODO: Missing API Rate limit
  public async iterateEntities(iteratee: ResourceIteratee<XMCyberEntity>) {
    const entitiestPath = '/systemReport/entities';
    // const entitiestPath = '/entityInventory/entities';

    let page = 1;

    do {
      const searchParams = new URLSearchParams({
        page: String(page),
        pageSize: String(ITEMS_PER_PAGE),
        // TODO: Add this filter and read from config.
        // 'entityTypeIds[]': 'agent',
      });
      const endpoint = `${entitiestPath}?${searchParams.toString()}`;

      const response = await this.request<any>(
        // TODO: Add filter type entityId = agent
        endpoint,
        Method.GET,
      );
      const result = await response.json();

      const totalPages = result.paging.totalPages;
      const currentPage = Number(result.paging.page);

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
      const response = await this.request<void>(endpoint, Method.GET);
      if (!response.ok) {
        throw new Error('Provider authentication failed');
      }
    } catch (err) {
      throw new IntegrationProviderAuthenticationError({
        cause: err,
        endpoint: this.BASE_URL + endpoint,
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  private async request<T>(
    endpoint: string,
    method: Method,
    body?: {},
  ): Promise<XMCyberResponse<T>> {
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
    }

    return response;
  }
}

export function createAPIClient(
  config: IntegrationConfig,
  logger: IntegrationLogger,
): APIClient {
  return new APIClient(config, logger);
}
