import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IRejectReceiveOrderOutput {
  matched_count: number
  modified_count: number
}
export interface IRejectReceiveOrderRepository {
  handle(_id: string, document: IDocument): Promise<IRejectReceiveOrderOutput>
}

export class RejectReceiveOrderRepository implements IRejectReceiveOrderRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string, document: IDocument): Promise<IRejectReceiveOrderOutput> {
    return await this.database.collection(collectionName).update(_id, { $set: document }, this.options)
  }
}
