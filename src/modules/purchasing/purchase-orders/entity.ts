import { IPurchaseOrderEntity } from './interface'

type typeDate = 'created_date' | 'updated_date' | 'approval_date' | 'request_approval_date'

export const collectionName = 'purchase_orders'

export class PurchaseOrderEntity {
  constructor(public data: IPurchaseOrderEntity) {}

  public generateCreatedDate() {
    this.data.created_date = new Date()
  }

  public generateUpdatedDate() {
    this.data.updated_date = new Date()
  }

  public generateDate(key: typeDate) {
    this.data[key] = new Date()
  }
}
