import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateManyItemOutput {
  inserted_count: number
  inserted_ids: string[]
}
export interface ICreateManyItemRepository {
  handle(documents: IDocument[]): Promise<ICreateManyItemOutput>
}

export class CreateManyItemRepository implements ICreateManyItemRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(documents: IDocument[]): Promise<ICreateManyItemOutput> {
    return await this.database.collection(collectionName).createMany(documents, this.options)
  }
}
