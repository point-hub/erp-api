import type { IDatabase, IDeleteOutput, IDeleteRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDeleteCustomerGroupOutput extends IDeleteOutput {}
export interface IDeleteCustomerGroupRepository extends IDeleteRepository {
  handle(_id: string, options?: unknown): Promise<IDeleteCustomerGroupOutput>
}

export class DeleteRepository implements IDeleteCustomerGroupRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, options?: unknown): Promise<IDeleteCustomerGroupOutput> {
    return await this.database.collection(collectionName).delete(_id, options)
  }
}
