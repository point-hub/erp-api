import type { IDatabase, IQuery } from '@point-hub/papi'

import { collectionName } from '../entity'
import { IRetrieveUserOutput } from './retrieve.repository'
import { IRetrieveAllUserOutput, IRetrieveAllUserRepository } from './retrieve-all.repository'

export class RetrieveExistingEmailRepository implements IRetrieveAllUserRepository {
  public collection = collectionName

  constructor(public database: IDatabase) {}

  async handle(query: IQuery, options?: unknown): Promise<IRetrieveAllUserOutput> {
    const response = await this.database.collection(this.collection).retrieveAll(query, options)
    return {
      data: response.data as unknown as IRetrieveUserOutput[],
      pagination: response.pagination,
    }
  }
}
