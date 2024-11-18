import type { IDatabase, IQuery } from '@point-hub/papi'

import { collectionName } from '../entity'
import { IRetrieveUserOutput } from './retrieve.repository'
import { IRetrieveAllUserOutput, IRetrieveAllUserRepository } from './retrieve-all.repository'

export class RetrieveExistingUsernameRepository implements IRetrieveAllUserRepository {
  public collection = collectionName

  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(query: IQuery): Promise<IRetrieveAllUserOutput> {
    const response = await this.database.collection(this.collection).retrieveAll(query, this.options)
    return {
      data: response.data as unknown as IRetrieveUserOutput[],
      pagination: response.pagination,
    }
  }
}
