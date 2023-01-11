export interface Account {
  id: string;
  name: string;
}

export interface XMCyberEntitiesResponse {
  paging: Paging;
  data: XMCyberEntity[];
}

export interface XMCyberEntity {
  _id: string;
  affectedAssets: AffectedAssets;
  affectedEntities: AffectedEntities;
  affectedUniqueAssets: AffectedUniqueAssets;
  affectedUniqueEntities: AffectedUniqueEntities;
  agentId?: string;
  asset?: boolean;
  assetAt?: string;
  attackComplexity: AttackComplexity;
  attackedByTechniques: AttackedByTechnique[];
  color: string;
  compromised: boolean;
  compromisedRate: CompromisedRate;
  discovered?: boolean;
  discoveredAt?: string;
  displayName: string;
  entityId: string;
  entityType: string;
  name: string;
  os?: Os;
  startingPoint?: boolean;
  startingPointAt?: string;
  tags?: Tag[];
  labels?: Label[];
}

interface AttackedByTechnique {
  technique: string;
  displayName: string;
  count: number;
}

interface AffectedEntities {
  max: Max;
  min: Min;
  avg: Avg;
  count: Count;
  sum: Sum;
}

interface AffectedAssets {
  max: Max;
  min: Min;
  avg: Avg;
  count: Count;
  sum: Sum;
}

interface Max {
  value: number;
}

interface Min {
  value: number;
}

interface Avg {
  value: number;
  score: number;
  level: string;
}

interface Count {
  value: number;
  score: number;
  level: string;
}

interface AffectedUniqueAssets {
  count: Count;
}

interface AffectedUniqueEntities {
  count: Count;
}

interface AttackComplexity {
  max: Max;
  min: Min;
  avg: Avg;
  count: Count;
  sum: Sum;
}

interface Tag {
  key: string;
  value: string;
}

interface Os {
  type: string;
  version: Version;
  servicePack: ServicePack;
  distributionName: string;
  distributionVersion: string;
  name: string;
}

interface ServicePack {
  build: number;
  major: number;
  minor: number;
  patch: number;
}

interface Paging {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  nextLink: string;
}

interface CompromisedRate {
  compromised: number;
  total: number;
  score: number;
  level: string;
}

interface Sum {
  value: number;
}

interface Version {
  build: number;
  major: number;
  minor: number;
  patch: number;
}

interface Label {
  label: string;
}

export interface RateLimitStatus {
  limit: number;
  remaining: number;
  reset: number;
}

export enum Method {
  GET = 'get',
}
