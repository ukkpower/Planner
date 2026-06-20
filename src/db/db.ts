import Dexie, { type Table } from 'dexie'
import type { Asset } from '../types/asset'
import type { Board, BoardItem } from '../types/board'
import type { Level } from '../types/level'
import type { AppSettings } from '../types/settings'
import { databaseName, schemaV1 } from './schema'

class PlannerDatabase extends Dexie {
  levels!: Table<Level, string>
  boards!: Table<Board, string>
  boardItems!: Table<BoardItem, string>
  assets!: Table<Asset, string>
  settings!: Table<AppSettings, string>

  constructor() {
    super(databaseName)
    this.version(1).stores(schemaV1)
  }
}

export const db = new PlannerDatabase()
