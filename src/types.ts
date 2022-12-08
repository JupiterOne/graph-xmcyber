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

export interface AttackedByTechnique {
  technique: string;
  displayName: string;
  count: number;
}

export interface AffectedEntities {
  max: Max;
  min: Min;
  avg: Avg;
  count: Count;
  sum: Sum;
}

export interface AffectedAssets {
  max: Max;
  min: Min;
  avg: Avg;
  count: Count;
  sum: Sum;
}

export interface Max {
  value: number;
}

export interface Min {
  value: number;
}

export interface Avg {
  value: number;
  score: number;
  level: string;
}

export interface Count {
  value: number;
  score: number;
  level: string;
}

export interface AffectedUniqueAssets {
  count: Count;
}

export interface AffectedUniqueEntities {
  count: Count;
}

export interface AttackComplexity {
  max: Max;
  min: Min;
  avg: Avg;
  count: Count;
  sum: Sum;
}

export interface Tag {
  key: string;
  value: string;
}

export interface Os {
  type: string;
  version: Version;
  servicePack: ServicePack;
  distributionName: string;
  distributionVersion: string;
  name: string;
}

export interface ServicePack {
  build: number;
  major: number;
  minor: number;
  patch: number;
}

export interface Paging {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  nextLink: string;
}

export interface CompromisedRate {
  compromised: number;
  total: number;
  score: number;
  level: string;
}

export interface Sum {
  value: number;
}

export interface Version {
  build: number;
  major: number;
  minor: number;
  patch: number;
}

export interface Label {
  label: string;
}

export enum Method {
  GET = 'get',
}
