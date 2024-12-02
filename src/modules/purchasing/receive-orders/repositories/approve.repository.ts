import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IApproveReceiveOrderOutput {
  matched_count: number
  modified_count: number
}
export interface IApproveReceiveOrderRepository {
  handle(_id: string, document: IDocument): Promise<IApproveReceiveOrderOutput>
}

export class ApproveReceiveOrderRepository implements IApproveReceiveOrderRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string, document: IDocument): Promise<IApproveReceiveOrderOutput> {
    return await this.database.collection(collectionName).update(_id, { $set: document }, this.options)
  }
}
