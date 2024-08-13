import { ISupplierGroupEntity } from './interface'

export const collectionName = 'supplier_groups'

export class SupplierGroupEntity {
  constructor(public data: ISupplierGroupEntity) {}

  public generateCreatedDate() {
    this.data.created_date = new Date()
  }

  public generateUpdatedDate() {
    this.data.updated_date = new Date()
  }
}
