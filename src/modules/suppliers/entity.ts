import { ISupplierEntity } from './interface'

export const collectionName = 'suppliers'

export class SupplierEntity {
  constructor(public data: ISupplierEntity) {}

  public generateCreatedDate() {
    this.data.created_date = new Date()
  }

  public generateUpdatedDate() {
    this.data.updated_date = new Date()
  }
}
