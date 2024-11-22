import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateCustomerGroupOutput {
  inserted_id: string
}
export interface ICreateCustomerGroupRepository {
  handle(document: IDocument): Promise<ICreateCustomerGroupOutput>
}

export class CreateCustomerGroupRepository implements ICreateCustomerGroupRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(document: IDocument): Promise<ICreateCustomerGroupOutput> {
    return await this.database.collection(collectionName).create(document, this.options)
  }
}
