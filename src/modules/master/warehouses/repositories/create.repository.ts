import type { ICreateOutput, ICreateRepository, IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ICreateWarehouseOutput extends ICreateOutput {}
export interface ICreateWarehouseRepository extends ICreateRepository {
  handle(document: IDocument, options?: unknown): Promise<ICreateWarehouseOutput>
}

export class CreateWarehouseRepository implements ICreateWarehouseRepository {
  constructor(public database: IDatabase) {}

  async handle(document: IDocument, options?: unknown): Promise<ICreateWarehouseOutput> {
    return await this.database.collection(collectionName).create(document, options)
  }
}
