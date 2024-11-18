import { BaseFactory, type IDatabase } from '@point-hub/papi'

import { IFormulaEntity } from './interface'
import { CreateFormulaRepository } from './repositories/create.repository'
import { CreateManyFormulaRepository } from './repositories/create-many.repository'

export default class FormulaFactory extends BaseFactory<IFormulaEntity> {
  constructor(public dbConnection: IDatabase) {
    super()
  }

  definition() {
    return {
      created_date: new Date(),
    }
  }

  async create() {
    const createFormulaRepository = new CreateFormulaRepository(this.dbConnection)
    return await createFormulaRepository.handle(this.makeOne())
  }

  async createMany(count: number) {
    const createManyFormulaRepository = new CreateManyFormulaRepository(this.dbConnection)
    return await createManyFormulaRepository.handle(this.makeMany(count))
  }
}
