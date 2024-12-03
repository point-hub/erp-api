import { IPurchaseInvoiceEntity } from './interface'

export const collectionName = 'purchase_invoices'

export const formNumberPrefix = 'PI'

export class PurchaseInvoiceEntity {
  constructor(public data: IPurchaseInvoiceEntity) {}
}
