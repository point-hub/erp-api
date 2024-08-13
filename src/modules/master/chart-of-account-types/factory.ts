import { faker } from '@faker-js/faker'
import { BaseFactory, type IDatabase } from '@point-hub/papi'

import { IChartOfAccountTypeTypeEntity } from './interface'
import { CreateChartOfAccountTypeRepository } from './repositories/create.repository'
import { CreateManyChartOfAccountTypeRepository } from './repositories/create-many.repository'

export default class ChartOfAccountTypeFactory extends BaseFactory<IChartOfAccountTypeTypeEntity> {
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
    const createChartOfAccountTypeRepository = new CreateChartOfAccountTypeRepository(this.dbConnection)
    return await createChartOfAccountTypeRepository.handle(this.makeOne())
  }

  async createMany(count: number) {
    const createManyChartOfAccountTypeRepository = new CreateManyChartOfAccountTypeRepository(this.dbConnection)
    return await createManyChartOfAccountTypeRepository.handle(this.makeMany(count))
  }
}
