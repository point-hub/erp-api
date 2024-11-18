import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateCustomerOutput {
  inserted_id: string
}
export interface ICreateCustomerRepository {
  handle(document: IDocument): Promise<ICreateCustomerOutput>
}

export class CreateCustomerRepository implements ICreateCustomerRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(document: IDocument): Promise<ICreateCustomerOutput> {
    return await this.database.collection(collectionName).create(document, this.options)
  }
}
