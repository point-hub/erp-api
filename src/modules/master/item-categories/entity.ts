import { IItemCategoryEntity } from './interface'

export type TypeFieldDate = 'created_date' | 'updated_date'

export const collectionName = 'item_categories'

export class ItemCategoryEntity {
  constructor(public data: IItemCategoryEntity) {}

  public generateDate(field: TypeFieldDate) {
    this.data[field] = new Date()
  }
}
