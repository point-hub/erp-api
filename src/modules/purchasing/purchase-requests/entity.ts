import { IPurchaseRequestEntity } from './interface'

export const collectionName = 'purchase_requests'

export class PurchaseRequestEntity {
  constructor(public data: IPurchaseRequestEntity) {}

  public generateCreatedDate() {
    this.data.created_date = new Date()
  }

  public generateUpdatedDate() {
    this.data.updated_date = new Date()
  }
}
