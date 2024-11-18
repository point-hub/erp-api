import { IChartOfAccountTypeTypeEntity } from './interface'

export type TypeFieldDate = 'created_date' | 'updated_date'

export const collectionName = 'chart_of_account_types'

export class ChartOfAccountTypeTypeEntity {
  constructor(public data: IChartOfAccountTypeTypeEntity) {}

  public generateDate(field: TypeFieldDate) {
    this.data[field] = new Date()
  }
}
