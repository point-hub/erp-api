import { IChartOfAccountCategoryEntity } from './interface'

export const collectionName = 'chart_of_account_categories'

export class ChartOfAccountCategoryEntity {
  constructor(public data: IChartOfAccountCategoryEntity) {}

  public generateCreatedDate() {
    this.data.created_date = new Date()
  }

  public generateUpdatedDate() {
    this.data.updated_date = new Date()
  }
}
