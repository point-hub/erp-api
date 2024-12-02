import { type IDatabase } from '@point-hub/papi'

export const seed = async (dbConnection: IDatabase, options: unknown) => {
  console.info(`[truncate] Purchase Orders data`)
  // delete all data inside collection
  await dbConnection.collection('down_payments').deleteAll(options)
}
