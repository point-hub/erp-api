import { type IDatabase } from '@point-hub/papi'

export const seed = async (dbConnection: IDatabase, options: unknown) => {
  console.info(`[truncate] sales quotations data`)
  // delete all data inside collection
  await dbConnection.collection('sales_quotations').deleteAll(options)
}
