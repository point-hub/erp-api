import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IRetrieveCounterOutput {
  _id: string
  code: string
  name: string
  count: number
  created_date: Date
  updated_date: Date
}

export interface IRetrieveCounterRepository {
  handle(_id: string): Promise<IRetrieveCounterOutput>
}

export class RetrieveCounterRepository implements IRetrieveCounterRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string): Promise<IRetrieveCounterOutput> {
    const response = await this.database.collection(collectionName).retrieve(_id, this.options)
    return {
      _id: response._id,
      code: response.code as string,
      name: response.name as string,
      count: response.name as number,
      created_date: response.created_date as Date,
      updated_date: response.updated_date as Date,
    }
  }
}
