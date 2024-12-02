import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateReceiveOrderOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateReceiveOrderRepository {
  handle(_id: string, document: IDocument): Promise<IUpdateReceiveOrderOutput>
}

export class UpdateReceiveOrderRepository implements IUpdateReceiveOrderRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string, document: IDocument): Promise<IUpdateReceiveOrderOutput> {
    return await this.database.collection(collectionName).update(_id, { $set: document }, this.options)
  }
}
