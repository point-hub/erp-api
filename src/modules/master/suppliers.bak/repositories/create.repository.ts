import type { ICreateOutput, ICreateRepository, IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ICreateSupplierOutput extends ICreateOutput {}
export interface ICreateSupplierRepository extends ICreateRepository {
  handle(document: IDocument, options?: unknown): Promise<ICreateSupplierOutput>
}

export class CreateSupplierRepository implements ICreateSupplierRepository {
  constructor(public database: IDatabase) {}

  async handle(document: IDocument, options?: unknown): Promise<ICreateSupplierOutput> {
    return await this.database.collection(collectionName).create(document, options)
  }
}
