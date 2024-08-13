import type { IDatabase, IDeleteOutput, IDeleteRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDeleteCustomerOutput extends IDeleteOutput {}
export interface IDeleteCustomerRepository extends IDeleteRepository {
  handle(_id: string, options?: unknown): Promise<IDeleteCustomerOutput>
}

export class DeleteCustomerRepository implements IDeleteCustomerRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, options?: unknown): Promise<IDeleteCustomerOutput> {
    return await this.database.collection(collectionName).delete(_id, options)
  }
}
