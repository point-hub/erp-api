import { faker } from '@faker-js/faker'
import { BaseFactory, type IDatabase } from '@point-hub/papi'

import { ICounterEntity } from './interface'
import { CreateCounterRepository } from './repositories/create.repository'
import { CreateManyCounterRepository } from './repositories/create-many.repository'

export default class CounterFactory extends BaseFactory<ICounterEntity> {
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
    const createCounterRepository = new CreateCounterRepository(this.dbConnection)
    return await createCounterRepository.handle(this.makeOne())
  }

  async createMany(count: number) {
    const createManyCounterRepository = new CreateManyCounterRepository(this.dbConnection)
    return await createManyCounterRepository.handle(this.makeMany(count))
  }
}
