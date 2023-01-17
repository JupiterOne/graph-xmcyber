export function generateEntityKey(type: string, id: string | number) {
  if (!type || !id) {
    throw new Error(
      `Failed to generate valid entity key: type ${type}, id ${id}}`,
    );
  }
  return `${type}_${id}`;
}
