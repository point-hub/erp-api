import type { ICreateOutput, ICreateRepository, IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ICreateCustomerOutput extends ICreateOutput {}
export interface ICreateCustomerRepository extends ICreateRepository {
  handle(document: IDocument, options?: unknown): Promise<ICreateCustomerOutput>
}

export class CreateCustomerRepository implements ICreateCustomerRepository {
  constructor(public database: IDatabase) {}

  async handle(document: IDocument, options?: unknown): Promise<ICreateCustomerOutput> {
    return await this.database.collection(collectionName).create(document, options)
  }
}
