import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateManyCustomerGroupOutput {
  inserted_count: number
  inserted_ids: string[]
}
export interface ICreateManyCustomerGroupRepository {
  handle(documents: IDocument[], options?: unknown): Promise<ICreateManyCustomerGroupOutput>
}

export class CreateManyCustomerGroupRepository implements ICreateManyCustomerGroupRepository {
  constructor(public database: IDatabase) {}

  async handle(documents: IDocument[], options?: unknown): Promise<ICreateManyCustomerGroupOutput> {
    return await this.database.collection(collectionName).createMany(documents, options)
  }
}
