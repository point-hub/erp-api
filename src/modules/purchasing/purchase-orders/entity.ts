import { IPurchaseOrderEntity } from './interface'

export const collectionName = 'purchase_orders'

export const formNumberPrefix = 'PO'

export class PurchaseOrderEntity {
  constructor(public data: IPurchaseOrderEntity) {}
}
