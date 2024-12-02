import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateManyDownPaymentOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateManyDownPaymentRepository {
  handle(filter: IDocument, document: IDocument): Promise<IUpdateManyDownPaymentOutput>
}

export class UpdateManyDownPaymentRepository implements IUpdateManyDownPaymentRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(filter: IDocument, document: IDocument): Promise<IUpdateManyDownPaymentOutput> {
    return await this.database.collection(collectionName).updateMany(filter, { $set: document }, this.options)
  }
}
