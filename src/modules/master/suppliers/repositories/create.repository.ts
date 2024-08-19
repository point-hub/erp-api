import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateSupplierOutput {
  inserted_id: string
}
export interface ICreateSupplierRepository {
  handle(document: IDocument, options?: unknown): Promise<ICreateSupplierOutput>
}

export class CreateSupplierRepository implements ICreateSupplierRepository {
  constructor(public database: IDatabase) {}

  async handle(document: IDocument, options?: unknown): Promise<ICreateSupplierOutput> {
    return await this.database.collection(collectionName).create(document, options)
  }
}
