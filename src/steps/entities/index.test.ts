import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Recording, setupProjectRecording } from '../../../test/recording';
import { Steps, Entities, Relationships } from '../constants';

// See test/README.md for details
let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test('fetch-entities', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'fetch-entities',
  });

  const stepConfig = buildStepTestConfigForStep(Steps.ENTITIES);
  const stepResult = await executeStepWithDependencies(stepConfig);
  const { collectedEntities, collectedRelationships, encounteredTypes } =
    stepResult;

  expect(stepResult).toMatchStepMetadata(stepConfig);
  expect({
    numCollectedEntities: collectedEntities.length,
    numCollectedRelationships: collectedRelationships.length,
    collectedEntities: collectedEntities,
    collectedRelationships: collectedRelationships,
    encounteredTypes: encounteredTypes,
  }).toMatchSnapshot();
  const entities = collectedEntities.filter(
    (e) => e._type === Entities.ENTITY._type,
  );
  expect(entities.length).toBeGreaterThan(0);
  expect(entities).toMatchGraphObjectSchema(Entities.ENTITY);

  const relationships = collectedRelationships.filter(
    (e) => e._type === Relationships.ACCOUNT_HAS_ENTITY._type,
  );
  expect(relationships.length).toBeGreaterThan(0);
});
