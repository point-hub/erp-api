import type { IDatabase, IDeleteOutput, IDeleteRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDeleteSupplierGroupOutput extends IDeleteOutput {}
export interface IDeleteSupplierGroupRepository extends IDeleteRepository {
  handle(_id: string, options?: unknown): Promise<IDeleteSupplierGroupOutput>
}

export class DeleteSupplierGroupRepository implements IDeleteSupplierGroupRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, options?: unknown): Promise<IDeleteSupplierGroupOutput> {
    return await this.database.collection(collectionName).delete(_id, options)
  }
}
