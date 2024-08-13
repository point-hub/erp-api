import { ICustomerEntity } from './interface'

export const collectionName = 'customers'

export class CustomerEntity {
  constructor(public data: ICustomerEntity) {}

  public generateCreatedDate() {
    this.data.created_date = new Date()
  }

  public generateUpdatedDate() {
    this.data.updated_date = new Date()
  }
}
