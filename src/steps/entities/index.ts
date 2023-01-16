import {
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
  createDirectRelationship,
} from '@jupiterone/integration-sdk-core';
import { createXMCyberClient } from '../../client';

import { ACCOUNT_ENTITY_KEY } from '../account';
import { IntegrationConfig } from '../../config';
import { Steps, Entities, Relationships } from '../constants';
import { createEntityEntity } from './converter';

export const ENTITY_ENTITY_KEY = 'entity:entity';

export async function fetchEntities({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;
  const client = createXMCyberClient(instance.config, logger);

  await client.iterateEntities(async (entity) => {
    const entityEntity = createEntityEntity(entity);
    await jobState.addEntity(entityEntity);

    const accountEntityRelationship = createDirectRelationship({
      from: accountEntity,
      _class: RelationshipClass.HAS,
      to: entityEntity,
    });
    await jobState.addRelationship(accountEntityRelationship);
  });
}

export const entitiesSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.ENTITIES,
    name: 'Fetch Entities',
    entities: [Entities.ENTITY],
    relationships: [Relationships.ACCOUNT_HAS_ENTITY],
    dependsOn: [Steps.ACCOUNT],
    executionHandler: fetchEntities,
  },
];
