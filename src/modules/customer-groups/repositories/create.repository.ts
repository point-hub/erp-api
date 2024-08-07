import type { ICreateOutput, ICreateRepository, IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ICreateCustomerGroupOutput extends ICreateOutput {}
export interface ICreateCustomerGroupRepository extends ICreateRepository {
  handle(document: IDocument, options?: unknown): Promise<ICreateCustomerGroupOutput>
}

export class CreateRepository implements ICreateCustomerGroupRepository {
  constructor(public database: IDatabase) {}

  async handle(document: IDocument, options?: unknown): Promise<ICreateCustomerGroupOutput> {
    return await this.database.collection(collectionName).create(document, options)
  }
}
