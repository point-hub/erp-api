import { IPurchaseOrderEntity } from './interface'

export const collectionName = 'purchase_orders'

export class PurchaseOrderEntity {
  constructor(public data: IPurchaseOrderEntity) {}

  public generateCreatedDate() {
    this.data.created_date = new Date()
  }

  public generateUpdatedDate() {
    this.data.updated_date = new Date()
  }
}
