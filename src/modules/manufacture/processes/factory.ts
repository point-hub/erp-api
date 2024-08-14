import { faker } from '@faker-js/faker'
import { BaseFactory, type IDatabase } from '@point-hub/papi'

import { IProcessEntity } from './interface'
import { CreateProcessRepository } from './repositories/create.repository'
import { CreateManyProcessRepository } from './repositories/create-many.repository'

export default class ProcessFactory extends BaseFactory<IProcessEntity> {
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
    const createProcessRepository = new CreateProcessRepository(this.dbConnection)
    return await createProcessRepository.handle(this.makeOne())
  }

  async createMany(count: number) {
    const createManyProcessRepository = new CreateManyProcessRepository(this.dbConnection)
    return await createManyProcessRepository.handle(this.makeMany(count))
  }
}
