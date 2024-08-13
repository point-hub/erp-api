import { ICustomerGroupEntity } from './interface'

export const collectionName = 'customer_groups'

export class CustomerGroupEntity {
  constructor(public data: ICustomerGroupEntity) {}

  public generateCreatedDate() {
    this.data.created_date = new Date()
  }

  public generateUpdatedDate() {
    this.data.updated_date = new Date()
  }
}
