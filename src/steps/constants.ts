import { StepEntityMetadata } from '@jupiterone/integration-sdk-core';

export const Steps = {
  ENTITIES: 'fetch-entities',
};

export const Entities: Record<'ENTITY', StepEntityMetadata> = {
  ENTITY: {
    resourceName: 'Entities',
    _type: 'xmcyber_entities',
    _class: ['Record'],
  },
};
