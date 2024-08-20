import { type IDatabase } from '@point-hub/papi'

export const seed = async (dbConnection: IDatabase, options: unknown) => {
  console.info(`[truncate] purchase requests data`)
  // delete all data inside collection
  await dbConnection.collection('purchase_requests').deleteAll(options)
}
