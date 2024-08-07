import type { IDatabase, IDocument, IUpdateManyOutput, IUpdateManyRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IUpdateManyCustomerGroupOutput extends IUpdateManyOutput {}
export interface IUpdateManyCustomerGroupRepository extends IUpdateManyRepository {
  handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManyCustomerGroupOutput>
}

export class UpdateManyRepository implements IUpdateManyCustomerGroupRepository {
  constructor(public database: IDatabase) {}

  async handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManyCustomerGroupOutput> {
    return await this.database.collection(collectionName).updateMany(filter, document, options)
  }
}
