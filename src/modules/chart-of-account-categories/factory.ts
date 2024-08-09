import { faker } from '@faker-js/faker'
import { BaseFactory, type IDatabase } from '@point-hub/papi'

import { IChartOfAccountCategoryEntity } from './interface'
import { CreateChartOfAccountCategoryRepository } from './repositories/create.repository'
import { CreateManyChartOfAccountCategoryRepository } from './repositories/create-many.repository'

export default class ChartOfAccountCategoryFactory extends BaseFactory<IChartOfAccountCategoryEntity> {
  constructor(public dbConnection: IDatabase) {
    super()
  }

  definition() {
    return {
      name: faker.person.fullName(),
      created_date: new Date(),
    }
  }

  async create() {
    const createChartOfAccountCategoryRepository = new CreateChartOfAccountCategoryRepository(this.dbConnection)
    return await createChartOfAccountCategoryRepository.handle(this.makeOne())
  }

  async createMany(count: number) {
    const createManyChartOfAccountCategoryRepository = new CreateManyChartOfAccountCategoryRepository(this.dbConnection)
    return await createManyChartOfAccountCategoryRepository.handle(this.makeMany(count))
  }
}
