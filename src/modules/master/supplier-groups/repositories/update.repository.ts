import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateSupplierGroupOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateSupplierGroupRepository {
  handle(_id: string, document: IDocument): Promise<IUpdateSupplierGroupOutput>
}

export class UpdateSupplierGroupRepository implements IUpdateSupplierGroupRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string, document: IDocument): Promise<IUpdateSupplierGroupOutput> {
    return await this.database.collection(collectionName).update(_id, document, this.options)
  }
}
