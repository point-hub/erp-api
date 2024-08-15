import type { IDatabase, IPipeline } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IRetrieveChartOfAccountTypeOutput {
  _id: string
  name: string
  created_date: Date
  updated_date: Date
}
export interface IRetrieveChartOfAccountTypeRepository {
  handle(_id: string, options?: unknown): Promise<IRetrieveChartOfAccountTypeOutput>
}

export class RetrieveChartOfAccountTypeRepository implements IRetrieveChartOfAccountTypeRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, options?: unknown): Promise<IRetrieveChartOfAccountTypeOutput> {
    const pipeline: IPipeline[] = []

    const response = await this.database.collection(collectionName).aggregate(pipeline, {}, options)

    return {
      _id: response.data[0]._id as string,
      name: response.data[0].name as string,
      created_date: response.data[0].created_date as Date,
      updated_date: response.data[0].updated_date as Date,
    }
  }
}
