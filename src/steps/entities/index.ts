import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { createXMCyberClient } from '../../client';

import { IntegrationConfig } from '../../config';
import { Steps, Entities } from '../constants';
import { createEntityEntity } from './converter';

export const ENTITY_ENTITY_KEY = 'entity:entity';

export async function fetchEntities({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = createXMCyberClient(instance.config, logger);

  await client.iterateEntities(async (entity) => {
    await jobState.addEntity(createEntityEntity(entity));
  });
}

export const entitiesSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.ENTITIES,
    name: 'Fetch Entities',
    entities: [Entities.ENTITY],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchEntities,
  },
];
