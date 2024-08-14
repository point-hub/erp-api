import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateManyBranchOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateManyBranchRepository {
  handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManyBranchOutput>
}

export class UpdateManyBranchRepository implements IUpdateManyBranchRepository {
  constructor(public database: IDatabase) {}

  async handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManyBranchOutput> {
    return await this.database.collection(collectionName).updateMany(filter, document, options)
  }
}
