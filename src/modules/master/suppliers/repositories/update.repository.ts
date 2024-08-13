import type { IDatabase, IDocument, IUpdateOutput, IUpdateRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IUpdateSupplierOutput extends IUpdateOutput {}
export interface IUpdateSupplierRepository extends IUpdateRepository {
  handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateSupplierOutput>
}

export class UpdateSupplierRepository implements IUpdateSupplierRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateSupplierOutput> {
    return await this.database.collection(collectionName).update(_id, document, options)
  }
}
