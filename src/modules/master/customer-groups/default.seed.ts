import { type IDatabase } from '@point-hub/papi'

export const seed = async (dbConnection: IDatabase, options: unknown) => {
  console.info(`[truncate] customer groups data`)
  // delete all data inside collection
  await dbConnection.collection('customer_groups').deleteAll(options)
}
