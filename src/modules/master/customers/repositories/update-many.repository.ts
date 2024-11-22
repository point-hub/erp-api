import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateManyCustomerOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateManyCustomerRepository {
  handle(filter: IDocument, document: IDocument): Promise<IUpdateManyCustomerOutput>
}

export class UpdateManyCustomerRepository implements IUpdateManyCustomerRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(filter: IDocument, document: IDocument): Promise<IUpdateManyCustomerOutput> {
    return await this.database.collection(collectionName).updateMany(filter, { $set: document }, this.options)
  }
}
