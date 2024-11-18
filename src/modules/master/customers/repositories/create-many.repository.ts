import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateManyCustomerOutput {
  inserted_count: number
  inserted_ids: string[]
}
export interface ICreateManyCustomerRepository {
  handle(documents: IDocument[]): Promise<ICreateManyCustomerOutput>
}

export class CreateManyCustomerRepository implements ICreateManyCustomerRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(documents: IDocument[]): Promise<ICreateManyCustomerOutput> {
    return await this.database.collection(collectionName).createMany(documents, this.options)
  }
}
