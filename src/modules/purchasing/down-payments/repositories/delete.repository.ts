import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteDownPaymentOutput {
  matched_count: number
  modified_count: number
}
export interface IDeleteDownPaymentRepository {
  handle(_id: string, document: IDocument): Promise<IDeleteDownPaymentOutput>
}

export class DeleteDownPaymentRepository implements IDeleteDownPaymentRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string, document: IDocument): Promise<IDeleteDownPaymentOutput> {
    return await this.database.collection(collectionName).update(_id, { $set: document }, this.options)
  }
}
