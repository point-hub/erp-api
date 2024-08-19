import { type IDatabase } from '@point-hub/papi'

export const seed = async (dbConnection: IDatabase, options: unknown) => {
  console.info(`[truncate] supplier groups data`)
  // delete all data inside collection
  await dbConnection.collection('supplier_groups').deleteAll(options)
}
