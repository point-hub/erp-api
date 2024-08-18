import { type IDatabase } from '@point-hub/papi'

export const seed = async (dbConnection: IDatabase, options: unknown) => {
  console.info(`[truncate] allocation groups data`)
  // delete all data inside collection
  await dbConnection.collection('allocation_groups').deleteAll(options)
}
