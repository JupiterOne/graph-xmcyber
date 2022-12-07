import { StepEntityMetadata } from '@jupiterone/integration-sdk-core';

export const Steps = {
  ENTITIES: 'fetch-entities',
};

export const Entities: Record<'ENTITY', StepEntityMetadata> = {
  ENTITY: {
    resourceName: 'Entity',
    _type: 'xmcyber_entity',
    _class: ['Entity'],
  },
};
