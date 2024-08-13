import type { IDatabase, IRetrieveOutput, IRetrieveRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IRetrieveCustomerGroupOutput extends IRetrieveOutput {
  code: string
  name: string
  created_date: string
  updated_date: string
}
export interface IRetrieveCustomerGroupRepository extends IRetrieveRepository {
  handle(_id: string, options?: unknown): Promise<IRetrieveCustomerGroupOutput>
}

export class RetrieveCustomerGroupRepository implements IRetrieveCustomerGroupRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, options?: unknown): Promise<IRetrieveCustomerGroupOutput> {
    const response = await this.database.collection(collectionName).retrieve(_id, options)
    return {
      _id: response._id,
      code: response.code as string,
      name: response.name as string,
      created_date: response.created_date as string,
      updated_date: response.updated_date as string,
    }
  }
}
