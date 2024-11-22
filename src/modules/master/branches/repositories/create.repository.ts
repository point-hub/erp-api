import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateBranchOutput {
  inserted_id: string
}
export interface ICreateBranchRepository {
  handle(document: IDocument): Promise<ICreateBranchOutput>
}

export class CreateBranchRepository implements ICreateBranchRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(document: IDocument): Promise<ICreateBranchOutput> {
    return await this.database.collection(collectionName).create(document, this.options)
  }
}
