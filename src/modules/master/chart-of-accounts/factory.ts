import { faker } from '@faker-js/faker'
import { BaseFactory, type IDatabase } from '@point-hub/papi'

import { IChartOfAccountEntity } from './interface'
import { CreateChartOfAccountRepository } from './repositories/create.repository'
import { CreateManyChartOfAccountRepository } from './repositories/create-many.repository'

export default class ChartOfAccountFactory extends BaseFactory<IChartOfAccountEntity> {
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
    const createChartOfAccountRepository = new CreateChartOfAccountRepository(this.dbConnection)
    return await createChartOfAccountRepository.handle(this.makeOne())
  }

  async createMany(count: number) {
    const createManyChartOfAccountRepository = new CreateManyChartOfAccountRepository(this.dbConnection)
    return await createManyChartOfAccountRepository.handle(this.makeMany(count))
  }
}
