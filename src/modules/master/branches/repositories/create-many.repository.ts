import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateManyBranchOutput {
  inserted_count: number
  inserted_ids: string[]
}
export interface ICreateManyBranchRepository {
  handle(documents: IDocument[]): Promise<ICreateManyBranchOutput>
}

export class CreateManyBranchRepository implements ICreateManyBranchRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(documents: IDocument[]): Promise<ICreateManyBranchOutput> {
    return await this.database.collection(collectionName).createMany(documents, this.options)
  }
}
