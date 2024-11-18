import { ISupplierGroupEntity } from './interface'

export type TypeFieldDate = 'created_date' | 'updated_date'

export const collectionName = 'supplier_groups'

export class SupplierGroupEntity {
  constructor(public data: ISupplierGroupEntity) {}

  public generateDate(field: TypeFieldDate) {
    this.data[field] = new Date()
  }
}
