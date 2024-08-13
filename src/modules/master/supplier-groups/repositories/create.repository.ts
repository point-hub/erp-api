import type { ICreateOutput, ICreateRepository, IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ICreateSupplierGroupOutput extends ICreateOutput {}
export interface ICreateSupplierGroupRepository extends ICreateRepository {
  handle(document: IDocument, options?: unknown): Promise<ICreateSupplierGroupOutput>
}

export class CreateSupplierGroupRepository implements ICreateSupplierGroupRepository {
  constructor(public database: IDatabase) {}

  async handle(document: IDocument, options?: unknown): Promise<ICreateSupplierGroupOutput> {
    return await this.database.collection(collectionName).create(document, options)
  }
}
