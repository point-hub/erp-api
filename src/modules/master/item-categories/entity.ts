import { IItemCategoryEntity } from './interface'

export const collectionName = 'item_categories'

export class ItemCategoryEntity {
  constructor(public data: IItemCategoryEntity) {}

  public generateCreatedDate() {
    this.data.created_date = new Date()
  }

  public generateUpdatedDate() {
    this.data.updated_date = new Date()
  }
}
