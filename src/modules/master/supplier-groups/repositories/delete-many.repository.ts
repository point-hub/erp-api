import type { IDatabase, IDeleteManyOutput, IDeleteManyRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDeleteManySupplierGroupOutput extends IDeleteManyOutput {}
export interface IDeleteManySupplierGroupRepository extends IDeleteManyRepository {
  handle(_ids: string[], options?: unknown): Promise<IDeleteManySupplierGroupOutput>
}

export class DeleteManySupplierGroupRepository implements IDeleteManySupplierGroupRepository {
  constructor(public database: IDatabase) {}

  async handle(ids: string[], options?: unknown): Promise<IDeleteManySupplierGroupOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, options)
  }
}
