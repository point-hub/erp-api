import { IChartOfAccountTypeTypeEntity } from './interface'

export const collectionName = 'chart_of_account_types'

export class ChartOfAccountTypeTypeEntity {
  constructor(public data: IChartOfAccountTypeTypeEntity) {}

  public generateCreatedDate() {
    this.data.created_date = new Date()
  }

  public generateUpdatedDate() {
    this.data.updated_date = new Date()
  }
}
