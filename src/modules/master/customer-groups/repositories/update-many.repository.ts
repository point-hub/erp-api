import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateManyCustomerGroupOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateManyCustomerGroupRepository {
  handle(filter: IDocument, document: IDocument): Promise<IUpdateManyCustomerGroupOutput>
}

export class UpdateManyCustomerGroupRepository implements IUpdateManyCustomerGroupRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(filter: IDocument, document: IDocument): Promise<IUpdateManyCustomerGroupOutput> {
    return await this.database.collection(collectionName).updateMany(filter, { $set: document }, this.options)
  }
}
