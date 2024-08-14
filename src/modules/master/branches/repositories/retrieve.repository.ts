import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IRetrieveBranchOutput {
  _id: string
  code: string
  name: string
  address: string
  phone: string
  notes: string
  created_date: string
  updated_date: string
}
export interface IRetrieveBranchRepository {
  handle(_id: string, options?: unknown): Promise<IRetrieveBranchOutput>
}

export class RetrieveBranchRepository implements IRetrieveBranchRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, options?: unknown): Promise<IRetrieveBranchOutput> {
    const response = await this.database.collection(collectionName).retrieve(_id, options)
    return {
      _id: response._id,
      code: response.code as string,
      name: response.name as string,
      address: response.address as string,
      phone: response.phone as string,
      notes: response.notes as string,
      created_date: response.created_date as string,
      updated_date: response.updated_date as string,
    }
  }
}
