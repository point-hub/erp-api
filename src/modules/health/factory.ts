import { faker } from '@faker-js/faker'
import { BaseFactory, type IDatabase } from '@point-hub/papi'

import { IHealthEntity } from './interface'
import { CreateHealthRepository } from './repositories/create.repository'
import { CreateManyHealthRepository } from './repositories/create-many.repository'

export default class HealthFactory extends BaseFactory<IHealthEntity> {
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
    const createHealthRepository = new CreateHealthRepository(this.dbConnection)
    return await createHealthRepository.handle(this.makeOne())
  }

  async createMany(count: number) {
    const createManyHealthRepository = new CreateManyHealthRepository(this.dbConnection)
    return await createManyHealthRepository.handle(this.makeMany(count))
  }
}
