import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateManyCounterOutput {
  matched_count: number
  modified_count: number
}

export interface IUpdateManyCounterRepository {
  handle(filter: IDocument, document: IDocument): Promise<IUpdateManyCounterOutput>
}

export class UpdateManyCounterRepository implements IUpdateManyCounterRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(filter: IDocument, document: IDocument): Promise<IUpdateManyCounterOutput> {
    return await this.database.collection(collectionName).updateMany(filter, { $set: document }, this.options)
  }
}
