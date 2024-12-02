import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteReceiveOrderOutput {
  matched_count: number
  modified_count: number
}
export interface IDeleteReceiveOrderRepository {
  handle(_id: string, document: IDocument): Promise<IDeleteReceiveOrderOutput>
}

export class DeleteReceiveOrderRepository implements IDeleteReceiveOrderRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string, document: IDocument): Promise<IDeleteReceiveOrderOutput> {
    return await this.database.collection(collectionName).update(_id, { $set: document }, this.options)
  }
}
