import { IItemEntity } from './interface'

export const collectionName = 'items'

export class ItemEntity {
  constructor(public data: IItemEntity) {}

  public generateCreatedDate() {
    this.data.created_date = new Date()
  }

  public generateUpdatedDate() {
    this.data.updated_date = new Date()
  }
}
