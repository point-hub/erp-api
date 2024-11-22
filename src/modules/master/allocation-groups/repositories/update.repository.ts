import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateAllocationGroupOutput {
  matched_count: number
  modified_count: number
}

export interface IUpdateAllocationGroupRepository {
  handle(_id: string, document: IDocument): Promise<IUpdateAllocationGroupOutput>
}

export class UpdateAllocationGroupRepository implements IUpdateAllocationGroupRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string, document: IDocument): Promise<IUpdateAllocationGroupOutput> {
    return await this.database.collection(collectionName).update(_id, { $set: document }, this.options)
  }
}
