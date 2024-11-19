import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateBranchOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateBranchRepository {
  handle(_id: string, document: IDocument): Promise<IUpdateBranchOutput>
}

export class UpdateBranchRepository implements IUpdateBranchRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string, document: IDocument): Promise<IUpdateBranchOutput> {
    return await this.database.collection(collectionName).update(_id, document, this.options)
  }
}
