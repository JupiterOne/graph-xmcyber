import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';
import { XMCyberEntity } from '../../types';

import { Entities } from '../constants';

export function createEntityEntity(entity: XMCyberEntity): Entity {
  return createIntegrationEntity({
    // TODO: set missing properties
    entityData: {
      source: entity,
      assign: {
        _key: entity._id,
        _type: Entities.ENTITY._type,
        _class: Entities.ENTITY._class,
        id: entity.entityId,
        name: entity.name,
        entityId: entity.entityId,
        entityType: entity.entityType,

        color: entity.color,
        discovered: entity.discovered,
        discoveredAt: entity.discoveredAt,
        compromised: entity.compromised,
        startingPoint: entity.startingPoint,
        startingPointAt: entity.startingPointAt,
        asset: entity.asset,
        assetAt: entity.assetAt,
        displayName: entity.displayName,
        affectedUniqueAssets: entity.affectedUniqueAssets.count.value,
        affectedUniqueEntities: entity.affectedUniqueEntities.count.value,
      },
    },
  });
}
