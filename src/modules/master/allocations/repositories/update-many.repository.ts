import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateManyAllocationOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateManyAllocationRepository {
  handle(filter: IDocument, document: IDocument): Promise<IUpdateManyAllocationOutput>
}

export class UpdateManyAllocationRepository implements IUpdateManyAllocationRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(filter: IDocument, document: IDocument): Promise<IUpdateManyAllocationOutput> {
    return await this.database.collection(collectionName).updateMany(filter, document, this.options)
  }
}
