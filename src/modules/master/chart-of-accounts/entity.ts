import { IChartOfAccountEntity } from './interface'

export type TypeFieldDate = 'created_date' | 'updated_date'

export const collectionName = 'chart_of_accounts'

export class ChartOfAccountEntity {
  constructor(public data: IChartOfAccountEntity) {}

  public generateDate(field: TypeFieldDate) {
    this.data[field] = new Date()
  }
}
