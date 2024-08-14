import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateManyProcessOutput {
  inserted_count: number
  inserted_ids: string[]
}
export interface ICreateManyProcessRepository {
  handle(documents: IDocument[], options?: unknown): Promise<ICreateManyProcessOutput>
}

export class CreateManyProcessRepository implements ICreateManyProcessRepository {
  constructor(public database: IDatabase) {}

  async handle(documents: IDocument[], options?: unknown): Promise<ICreateManyProcessOutput> {
    return await this.database.collection(collectionName).createMany(documents, options)
  }
}
