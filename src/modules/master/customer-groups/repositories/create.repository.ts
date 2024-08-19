import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateCustomerGroupOutput {
  inserted_id: string
}
export interface ICreateCustomerGroupRepository {
  handle(document: IDocument, options?: unknown): Promise<ICreateCustomerGroupOutput>
}

export class CreateCustomerGroupRepository implements ICreateCustomerGroupRepository {
  constructor(public database: IDatabase) {}

  async handle(document: IDocument, options?: unknown): Promise<ICreateCustomerGroupOutput> {
    return await this.database.collection(collectionName).create(document, options)
  }
}
