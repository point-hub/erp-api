import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateManyAllocationOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateManyAllocationRepository {
  handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManyAllocationOutput>
}

export class UpdateManyAllocationRepository implements IUpdateManyAllocationRepository {
  constructor(public database: IDatabase) {}

  async handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManyAllocationOutput> {
    return await this.database.collection(collectionName).updateMany(filter, document, options)
  }
}
