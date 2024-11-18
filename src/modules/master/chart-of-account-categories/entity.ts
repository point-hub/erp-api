import { IChartOfAccountCategoryEntity } from './interface'

export type TypeFieldDate = 'created_date' | 'updated_date'

export const collectionName = 'chart_of_account_categories'

export class ChartOfAccountCategoryEntity {
  constructor(public data: IChartOfAccountCategoryEntity) {}

  public generateDate(field: TypeFieldDate) {
    this.data[field] = new Date()
  }
}
