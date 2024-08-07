import type { IDatabase, IDocument, IUpdateManyOutput, IUpdateManyRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IUpdateManySupplierGroupOutput extends IUpdateManyOutput {}
export interface IUpdateManySupplierGroupRepository extends IUpdateManyRepository {
  handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManySupplierGroupOutput>
}

export class UpdateManyRepository implements IUpdateManySupplierGroupRepository {
  constructor(public database: IDatabase) {}

  async handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManySupplierGroupOutput> {
    return await this.database.collection(collectionName).updateMany(filter, document, options)
  }
}
