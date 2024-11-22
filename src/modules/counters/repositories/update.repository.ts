import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateCounterOutput {
  matched_count: number
  modified_count: number
}

export interface IUpdateCounterRepository {
  handle(_id: string, document: IDocument): Promise<IUpdateCounterOutput>
}

export class UpdateCounterRepository implements IUpdateCounterRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string, document: IDocument): Promise<IUpdateCounterOutput> {
    return await this.database.collection(collectionName).update(_id, { $set: document }, this.options)
  }
}
