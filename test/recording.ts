import {
  Recording,
  RecordingEntry,
  SetupRecordingInput,
  mutations,
  setupRecording,
} from '@jupiterone/integration-sdk-testing';

const DEFAULT_REDACT = '[REDACTED]';

export { Recording };

export function setupProjectRecording(
  input: Omit<SetupRecordingInput, 'mutateEntry'>,
): Recording {
  return setupRecording({
    ...input,
    redactedRequestHeaders: ['x-api-key'],
    redactedResponseHeaders: ['set-cookie'],
    mutateEntry: (entry) => {
      redact(entry);
    },
  });
}

function addNestedRedactedValue(
  obj: Record<string, unknown>,
  keys: string[],
  i: number,
): Record<string, unknown> {
  if (i >= keys.length) {
    return obj;
  }

  const key = keys[i];
  if (!(key in obj)) {
    return obj;
  }

  return {
    ...obj,
    [key]:
      typeof obj[key] === 'string'
        ? DEFAULT_REDACT
        : addNestedRedactedValue(
            obj[key] as Record<string, unknown>,
            keys,
            i + 1,
          ),
  };
}

function redact(entry: RecordingEntry): void {
  mutations.unzipGzippedRecordingEntry(entry);
  const keysToRedact = [
    'id',
    'accessKeyId',
    'entityId',
    'entityBasicData.entityUuid.displayValue',
    'entityBasicData.entityUuid.value',
  ];

  if (!entry.response.content.text?.length) {
    return;
  }

  const responseText = entry.response.content.text;
  const parsedResponseText = JSON.parse(responseText.replace(/\r?\n|\r/g, ''));

  if (parsedResponseText?.data?.length) {
    for (let i = 0; i < parsedResponseText.data.length; i++) {
      if (parsedResponseText.data[i].entityType !== 'awsAccessKey') {
        continue;
      }

      keysToRedact.forEach((key) => {
        const objKeys = key.split('.');
        parsedResponseText.data[i] = addNestedRedactedValue(
          parsedResponseText.data[i],
          objKeys,
          0,
        );
      });

      if (parsedResponseText.data[i].entityExtraData) {
        parsedResponseText.data[i].entityExtraData = parsedResponseText.data[
          i
        ].entityExtraData.map((extraData: Record<string, unknown>) => {
          if (extraData.name === 'accessKeyId') {
            return {
              ...extraData,
              displayValue: DEFAULT_REDACT,
              value: DEFAULT_REDACT,
            };
          }
          return extraData;
        });
      }
    }
  }

  entry.response.content.text = JSON.stringify(parsedResponseText);
}
