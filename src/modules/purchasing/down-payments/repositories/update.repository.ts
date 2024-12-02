import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateDownPaymentOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateDownPaymentRepository {
  handle(_id: string, document: IDocument): Promise<IUpdateDownPaymentOutput>
}

export class UpdateDownPaymentRepository implements IUpdateDownPaymentRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string, document: IDocument): Promise<IUpdateDownPaymentOutput> {
    return await this.database.collection(collectionName).update(_id, { $set: document }, this.options)
  }
}
