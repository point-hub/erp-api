import type { IDatabase, IDocument, IUpdateManyOutput, IUpdateManyRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IUpdateManySupplierOutput extends IUpdateManyOutput {}
export interface IUpdateManySupplierRepository extends IUpdateManyRepository {
  handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManySupplierOutput>
}

export class UpdateManySupplierRepository implements IUpdateManySupplierRepository {
  constructor(public database: IDatabase) {}

  async handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManySupplierOutput> {
    return await this.database.collection(collectionName).updateMany(filter, document, options)
  }
}
