import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateManyCustomerGroupOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateManyCustomerGroupRepository {
  handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManyCustomerGroupOutput>
}

export class UpdateManyCustomerGroupRepository implements IUpdateManyCustomerGroupRepository {
  constructor(public database: IDatabase) {}

  async handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManyCustomerGroupOutput> {
    return await this.database.collection(collectionName).updateMany(filter, document, options)
  }
}
