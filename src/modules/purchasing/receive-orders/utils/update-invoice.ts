import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateReceiveOrderInvoice {
  add(_id: string): Promise<void>
  delete(_id: string): Promise<void>
}

export class UpdateReceiveOrderInvoice implements IUpdateReceiveOrderInvoice {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async add(_id: string): Promise<void> {
    await this.database.collection(collectionName).update(_id, { $set: { has_invoice: true } }, this.options)
  }

  async delete(_id: string) {
    await this.database.collection(collectionName).update(_id, { $set: { has_invoice: false } }, this.options)
  }
}
