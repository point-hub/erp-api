import { IPurchaseRequestEntity } from './interface'

export const collectionName = 'purchase_requests'

export const formNumberPrefix = 'PR'

export class PurchaseRequestEntity {
  constructor(public data: IPurchaseRequestEntity) {}
}
