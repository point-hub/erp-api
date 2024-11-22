import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateManyCustomerGroupOutput {
  inserted_count: number
  inserted_ids: string[]
}
export interface ICreateManyCustomerGroupRepository {
  handle(documents: IDocument[]): Promise<ICreateManyCustomerGroupOutput>
}

export class CreateManyCustomerGroupRepository implements ICreateManyCustomerGroupRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(documents: IDocument[]): Promise<ICreateManyCustomerGroupOutput> {
    return await this.database.collection(collectionName).createMany(documents, this.options)
  }
}
