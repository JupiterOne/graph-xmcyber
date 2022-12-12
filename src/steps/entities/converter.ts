import {
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';
import { XMCyberEntity } from '../../types';

import { Entities } from '../constants';

export function createEntityEntity(entity: XMCyberEntity): Entity {
  return createIntegrationEntity({
    entityData: {
      source: entity,
      assign: {
        _key: entity._id,
        _type: Entities.ENTITY._type,
        _class: Entities.ENTITY._class,
        affectedAssetsCount: entity.affectedAssets.count.value,
        affectedEntitiesCount: entity.affectedEntities.count.value,
        affectedUniqueAssetsCount: entity.affectedUniqueAssets.count.value,
        affectedUniqueEntitiesCount: entity.affectedUniqueEntities.count.value,
        agentId: entity.agentId,
        asset: !!entity.asset,
        assetOn: parseTimePropertyValue(entity.assetAt),
        color: entity.color,
        compromised: entity.compromised,
        compromisedRateTotal: entity.compromisedRate?.total,
        discovered: entity.discovered,
        discoveredOn: parseTimePropertyValue(entity.discoveredAt),
        displayName: entity.displayName,
        entityId: entity.entityId,
        entityType: entity.entityType,
        id: entity.entityId,
        name: entity.name,
        osType: entity.os?.type,
        osVersionBuild: entity.os?.version.build,
        osVersionMajor: entity.os?.version.major,
        osVersionMinor: entity.os?.version.minor,
        osVersionPatch: entity.os?.version.patch,
        osServicePackBuild: entity.os?.servicePack.build,
        osServicePackMajor: entity.os?.servicePack.major,
        osServicePackMinor: entity.os?.servicePack.minor,
        osServicePackPatch: entity.os?.servicePack.patch,
        osDistributionName: entity.os?.distributionName,
        osDistributionVersion: entity.os?.distributionVersion,
        osName: entity.os?.name,
        startingPoint: entity.startingPoint,
        startingPointOn: parseTimePropertyValue(entity.startingPointAt),
        labels: entity.labels?.map(({ label }) => label),
        tags: entity.tags?.map(({ key, value }) => `${key}:${value}`),
      },
    },
  });
}
