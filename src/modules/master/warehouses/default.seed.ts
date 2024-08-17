import { type IDatabase } from '@point-hub/papi'

export const seed = async (dbConnection: IDatabase, options: unknown) => {
  console.info(`[truncate] warehouses data`)
  // delete all data inside collection
  await dbConnection.collection('warehouses').deleteAll(options)
}
