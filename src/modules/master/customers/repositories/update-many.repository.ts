import type { IDatabase, IDocument, IUpdateManyOutput, IUpdateManyRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IUpdateManyCustomerOutput extends IUpdateManyOutput {}
export interface IUpdateManyCustomerRepository extends IUpdateManyRepository {
  handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManyCustomerOutput>
}

export class UpdateManyCustomerRepository implements IUpdateManyCustomerRepository {
  constructor(public database: IDatabase) {}

  async handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManyCustomerOutput> {
    return await this.database.collection(collectionName).updateMany(filter, document, options)
  }
}
