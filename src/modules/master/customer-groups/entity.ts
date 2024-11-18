import { ICustomerGroupEntity } from './interface'

export type TypeFieldDate = 'created_date' | 'updated_date'

export const collectionName = 'customer_groups'

export class CustomerGroupEntity {
  constructor(public data: ICustomerGroupEntity) {}

  public generateDate(field: TypeFieldDate) {
    this.data[field] = new Date()
  }
}
