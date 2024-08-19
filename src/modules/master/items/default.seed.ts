import { type IDatabase } from '@point-hub/papi'

export const seed = async (dbConnection: IDatabase, options: unknown) => {
  console.info(`[truncate] items data`)
  // delete all data inside collection
  await dbConnection.collection('items').deleteAll(options)
}
