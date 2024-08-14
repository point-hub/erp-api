import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateBranchOutput {
  inserted_id: string
}
export interface ICreateBranchRepository {
  handle(document: IDocument, options?: unknown): Promise<ICreateBranchOutput>
}

export class CreateBranchRepository implements ICreateBranchRepository {
  constructor(public database: IDatabase) {}

  async handle(document: IDocument, options?: unknown): Promise<ICreateBranchOutput> {
    return await this.database.collection(collectionName).create(document, options)
  }
}
