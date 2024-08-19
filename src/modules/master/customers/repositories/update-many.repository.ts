import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateManyCustomerOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateManyCustomerRepository {
  handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManyCustomerOutput>
}

export class UpdateManyCustomerRepository implements IUpdateManyCustomerRepository {
  constructor(public database: IDatabase) {}

  async handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManyCustomerOutput> {
    return await this.database.collection(collectionName).updateMany(filter, document, options)
  }
}
