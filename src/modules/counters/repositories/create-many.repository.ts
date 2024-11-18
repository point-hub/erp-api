import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateManyCounterOutput {
  inserted_count: number
  inserted_ids: string[]
}

export interface ICreateManyCounterRepository {
  handle(documents: IDocument[]): Promise<ICreateManyCounterOutput>
}

export class CreateManyCounterRepository implements ICreateManyCounterRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(documents: IDocument[]): Promise<ICreateManyCounterOutput> {
    return await this.database.collection(collectionName).createMany(documents, this.options)
  }
}
