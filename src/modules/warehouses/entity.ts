import { IWarehouseEntity } from './interface'

export const collectionName = 'warehouses'

export class WarehouseEntity {
  constructor(public data: IWarehouseEntity) {}

  public generateCreatedDate() {
    this.data.created_date = new Date()
  }

  public generateUpdatedDate() {
    this.data.updated_date = new Date()
  }
}
