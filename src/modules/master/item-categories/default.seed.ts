import { type IDatabase } from '@point-hub/papi'

export const seed = async (dbConnection: IDatabase, options: unknown) => {
  console.info(`[truncate] item categories data`)
  // delete all data inside collection
  await dbConnection.collection('item_categories').deleteAll(options)
}
