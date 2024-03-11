import { IChartOfAccountEntity } from './interface'

export const collectionName = 'chart_of_accounts'

export class ChartOfAccountEntity {
  constructor(public data: IChartOfAccountEntity) {}

  public generateCreatedDate() {
    this.data.created_date = new Date()
  }

  public generateUpdatedDate() {
    this.data.updated_date = new Date()
  }
}
