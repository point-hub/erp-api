import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IApprovePurchaseOrderOutput {
  matched_count: number
  modified_count: number
}
export interface IApprovePurchaseOrderRepository {
  handle(_id: string, document: IDocument): Promise<IApprovePurchaseOrderOutput>
}

export class ApprovePurchaseOrderRepository implements IApprovePurchaseOrderRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string, document: IDocument): Promise<IApprovePurchaseOrderOutput> {
    return await this.database.collection(collectionName).update(_id, document, this.options)
  }
}
