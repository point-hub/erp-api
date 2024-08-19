import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateCustomerOutput {
  inserted_id: string
}
export interface ICreateCustomerRepository {
  handle(document: IDocument, options?: unknown): Promise<ICreateCustomerOutput>
}

export class CreateCustomerRepository implements ICreateCustomerRepository {
  constructor(public database: IDatabase) {}

  async handle(document: IDocument, options?: unknown): Promise<ICreateCustomerOutput> {
    return await this.database.collection(collectionName).create(document, options)
  }
}
