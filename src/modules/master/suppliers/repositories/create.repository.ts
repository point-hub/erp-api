import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateSupplierOutput {
  inserted_id: string
}
export interface ICreateSupplierRepository {
  handle(document: IDocument): Promise<ICreateSupplierOutput>
}

export class CreateSupplierRepository implements ICreateSupplierRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(document: IDocument): Promise<ICreateSupplierOutput> {
    return await this.database.collection(collectionName).create(document, this.options)
  }
}
