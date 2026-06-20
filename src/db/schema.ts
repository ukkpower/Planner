export const databaseName = 'cosy-level-planner'

export const schemaV1 = {
  levels: 'id, number, updatedAt',
  boards: 'id, [levelId+section]',
  boardItems: 'id, boardId, [boardId+zIndex]',
  assets: 'id',
  settings: 'id',
}
