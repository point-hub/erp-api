import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateCustomerGroupOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateCustomerGroupRepository {
  handle(_id: string, document: IDocument): Promise<IUpdateCustomerGroupOutput>
}

export class UpdateCustomerGroupRepository implements IUpdateCustomerGroupRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string, document: IDocument): Promise<IUpdateCustomerGroupOutput> {
    return await this.database.collection(collectionName).update(_id, { $set: document }, this.options)
  }
}
