import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateSupplierGroupOutput {
  inserted_id: string
}
export interface ICreateSupplierGroupRepository {
  handle(document: IDocument, options?: unknown): Promise<ICreateSupplierGroupOutput>
}

export class CreateSupplierGroupRepository implements ICreateSupplierGroupRepository {
  constructor(public database: IDatabase) {}

  async handle(document: IDocument, options?: unknown): Promise<ICreateSupplierGroupOutput> {
    return await this.database.collection(collectionName).create(document, options)
  }
}
