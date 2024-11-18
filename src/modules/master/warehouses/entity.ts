import { IWarehouseEntity } from './interface'

export type TypeFieldDate = 'created_date' | 'updated_date'

export const collectionName = 'warehouses'

export class WarehouseEntity {
  constructor(public data: IWarehouseEntity) {}

  public generateDate(field: TypeFieldDate) {
    this.data[field] = new Date()
  }
}
