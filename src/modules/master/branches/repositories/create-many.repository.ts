import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateManyBranchOutput {
  inserted_count: number
  inserted_ids: string[]
}
export interface ICreateManyBranchRepository {
  handle(documents: IDocument[], options?: unknown): Promise<ICreateManyBranchOutput>
}

export class CreateManyBranchRepository implements ICreateManyBranchRepository {
  constructor(public database: IDatabase) {}

  async handle(documents: IDocument[], options?: unknown): Promise<ICreateManyBranchOutput> {
    return await this.database.collection(collectionName).createMany(documents, options)
  }
}
