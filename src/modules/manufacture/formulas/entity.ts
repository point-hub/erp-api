import { IFormulaEntity } from './interface'

export const collectionName = 'formulas'

export class FormulaEntity {
  constructor(public data: IFormulaEntity) {}

  public generateDate('created_date') {
    this.data.created_date = new Date()
  }

  public generateDate('updated_date') {
    this.data.updated_date = new Date()
  }
}
