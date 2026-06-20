import { db } from '../db/db'
import type { Asset } from '../types/asset'

export const assetRepository = {
  async addAsset(asset: Asset) {
    await db.assets.add(asset)
  },

  async getAssets(assetIds: string[]) {
    if (assetIds.length === 0) {
      return []
    }

    const uniqueIds = [...new Set(assetIds)]
    return db.assets.bulkGet(uniqueIds).then((assets) => assets.filter(Boolean) as Asset[])
  },
}
