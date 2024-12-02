import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IRejectDownPaymentOutput {
  matched_count: number
  modified_count: number
}
export interface IRejectDownPaymentRepository {
  handle(_id: string, document: IDocument): Promise<IRejectDownPaymentOutput>
}

export class RejectDownPaymentRepository implements IRejectDownPaymentRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string, document: IDocument): Promise<IRejectDownPaymentOutput> {
    return await this.database.collection(collectionName).update(_id, { $set: document }, this.options)
  }
}
