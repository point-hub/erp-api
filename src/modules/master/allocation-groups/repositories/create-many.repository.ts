import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateManyAllocationGroupOutput {
  inserted_count: number
  inserted_ids: string[]
}

export interface ICreateManyAllocationGroupRepository {
  handle(documents: IDocument[], options?: unknown): Promise<ICreateManyAllocationGroupOutput>
}

export class CreateManyAllocationGroupRepository implements ICreateManyAllocationGroupRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(documents: IDocument[]): Promise<ICreateManyAllocationGroupOutput> {
    return await this.database.collection(collectionName).createMany(documents, this.options)
  }
}
