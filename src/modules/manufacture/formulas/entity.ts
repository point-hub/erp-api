import { IFormulaEntity } from './interface'

export const collectionName = 'formulas'

export class FormulaEntity {
  constructor(public data: IFormulaEntity) {}

  public generateCreatedDate() {
    this.data.created_date = new Date()
  }

  public generateUpdatedDate() {
    this.data.updated_date = new Date()
  }
}
