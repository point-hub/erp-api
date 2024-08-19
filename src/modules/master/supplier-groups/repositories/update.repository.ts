import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateSupplierGroupOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateSupplierGroupRepository {
  handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateSupplierGroupOutput>
}

export class UpdateSupplierGroupRepository implements IUpdateSupplierGroupRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateSupplierGroupOutput> {
    return await this.database.collection(collectionName).update(_id, document, options)
  }
}
