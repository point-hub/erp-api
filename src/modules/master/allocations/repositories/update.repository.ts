import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateAllocationOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateAllocationRepository {
  handle(_id: string, document: IDocument): Promise<IUpdateAllocationOutput>
}

export class UpdateAllocationRepository implements IUpdateAllocationRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string, document: IDocument): Promise<IUpdateAllocationOutput> {
    return await this.database.collection(collectionName).update(_id, document, options)
  }
}
