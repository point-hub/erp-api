import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateManyUserOutput {
  inserted_count: number
  inserted_ids: string[]
}
export interface ICreateManyUserRepository {
  handle(documents: IDocument[]): Promise<ICreateManyUserOutput>
}

export class CreateManyUserRepository implements ICreateManyUserRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(documents: IDocument[]): Promise<ICreateManyUserOutput> {
    return await this.database.collection(collectionName).createMany(documents, this.options)
  }
}
