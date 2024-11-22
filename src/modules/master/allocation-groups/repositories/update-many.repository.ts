import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateManyAllocationGroupOutput {
  matched_count: number
  modified_count: number
}

export interface IUpdateManyAllocationGroupRepository {
  handle(filter: IDocument, document: IDocument): Promise<IUpdateManyAllocationGroupOutput>
}

export class UpdateManyAllocationGroupRepository implements IUpdateManyAllocationGroupRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(filter: IDocument, document: IDocument): Promise<IUpdateManyAllocationGroupOutput> {
    return await this.database.collection(collectionName).updateMany(filter, { $set: document }, this.options)
  }
}
