import {
  StepEntityMetadata,
  RelationshipClass,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const Steps = {
  ACCOUNT: 'fetch-account',
  ENTITIES: 'fetch-entities',
};

export const Entities: Record<'ACCOUNT' | 'ENTITY', StepEntityMetadata> = {
  ACCOUNT: {
    resourceName: 'Account',
    _class: ['Account'],
    _type: 'xmcyber_account',
  },
  ENTITY: {
    resourceName: 'Entity',
    _type: 'xmcyber_entity',
    _class: ['Record'],
  },
};

export const Relationships: Record<
  'ACCOUNT_HAS_ENTITY',
  StepRelationshipMetadata
> = {
  ACCOUNT_HAS_ENTITY: {
    _type: 'xmcyber_account_has_entity',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.ENTITY._type,
  },
};
