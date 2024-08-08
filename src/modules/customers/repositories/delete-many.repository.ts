import type { IDatabase, IDeleteManyOutput, IDeleteManyRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDeleteManyCustomerOutput extends IDeleteManyOutput {}
export interface IDeleteManyCustomerRepository extends IDeleteManyRepository {
  handle(_ids: string[], options?: unknown): Promise<IDeleteManyCustomerOutput>
}

export class DeleteManyCustomerRepository implements IDeleteManyCustomerRepository {
  constructor(public database: IDatabase) {}

  async handle(ids: string[], options?: unknown): Promise<IDeleteManyCustomerOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, options)
  }
}
