import type { IDatabase, IDeleteManyOutput, IDeleteManyRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDeleteManySupplierOutput extends IDeleteManyOutput {}
export interface IDeleteManySupplierRepository extends IDeleteManyRepository {
  handle(_ids: string[], options?: unknown): Promise<IDeleteManySupplierOutput>
}

export class DeleteManySupplierRepository implements IDeleteManySupplierRepository {
  constructor(public database: IDatabase) {}

  async handle(ids: string[], options?: unknown): Promise<IDeleteManySupplierOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, options)
  }
}
