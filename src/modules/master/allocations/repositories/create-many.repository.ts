import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateManyAllocationOutput {
  inserted_count: number
  inserted_ids: string[]
}
export interface ICreateManyAllocationRepository {
  handle(documents: IDocument[]): Promise<ICreateManyAllocationOutput>
}

export class CreateManyAllocationRepository implements ICreateManyAllocationRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(documents: IDocument[]): Promise<ICreateManyAllocationOutput> {
    return await this.database.collection(collectionName).createMany(documents, this.options)
  }
}
