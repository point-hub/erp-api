import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateCustomerOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateCustomerRepository {
  handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateCustomerOutput>
}

export class UpdateCustomerRepository implements IUpdateCustomerRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateCustomerOutput> {
    return await this.database.collection(collectionName).update(_id, document, options)
  }
}
