import type { IDatabase, IRetrieveOutput, IRetrieveRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IRetrieveUserOutput extends IRetrieveOutput {
  name: string
  username: string
  email: string
  created_date: Date
  updated_date: Date
}
export interface IRetrieveUserRepository extends IRetrieveRepository {
  handle(_id: string, options?: unknown): Promise<IRetrieveUserOutput>
}

export class RetrieveUserRepository implements IRetrieveUserRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, options?: unknown): Promise<IRetrieveUserOutput> {
    const response = await this.database.collection(collectionName).retrieve(_id, options)
    return {
      _id: response._id,
      name: response.name as string,
      username: response.username as string,
      email: response.email as string,
      created_date: response.created_date as Date,
      updated_date: response.updated_date as Date,
    }
  }
}
