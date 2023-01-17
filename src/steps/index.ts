import { entitiesSteps } from './entities';
import { accountSteps } from './account';

const integrationSteps = [...accountSteps, ...entitiesSteps];

export { integrationSteps };
