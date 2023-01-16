import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const entitySpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://cyberrange.clients.xmcyber.com/api/systemReport/entities
     * PATTERN: Fetch Entities
     */
    id: 'fetch-entities',
    name: 'Fetch Entities',
    entities: [
      {
        resourceName: 'Entity',
        _type: 'xmcyber_entity',
        _class: ['Record'],
      },
    ],
    relationships: [
      {
        _class: RelationshipClass.HAS,
        _type: 'xmcyber_account_has_entity',
        sourceType: 'xmcyber_account',
        targetType: 'xmcyber_entity',
      },
    ],
    dependsOn: ['fetch-account'],
    implemented: true,
  },
];
