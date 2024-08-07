import type { IDatabase, IDocument, IUpdateManyOutput, IUpdateManyRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IUpdateManyWarehouseOutput extends IUpdateManyOutput {}
export interface IUpdateManyWarehouseRepository extends IUpdateManyRepository {
  handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManyWarehouseOutput>
}

export class UpdateManyWarehouseRepository implements IUpdateManyWarehouseRepository {
  constructor(public database: IDatabase) {}

  async handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManyWarehouseOutput> {
    return await this.database.collection(collectionName).updateMany(filter, document, options)
  }
}
