import type { IDatabase, IDeleteOutput, IDeleteRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDeleteSupplierOutput extends IDeleteOutput {}
export interface IDeleteSupplierRepository extends IDeleteRepository {
  handle(_id: string, options?: unknown): Promise<IDeleteSupplierOutput>
}

export class DeleteSupplierRepository implements IDeleteSupplierRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, options?: unknown): Promise<IDeleteSupplierOutput> {
    return await this.database.collection(collectionName).delete(_id, options)
  }
}
