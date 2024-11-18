import { BaseFactory, type IDatabase } from '@point-hub/papi'

import { IUserEntity } from './interface'
import { CreateUserRepository } from './repositories/create.repository'
import { CreateManyUserRepository } from './repositories/create-many.repository'

export default class UserFactory extends BaseFactory<IUserEntity> {
  constructor(public dbConnection: IDatabase) {
    super()
  }

  definition() {
    return {
      name: faker.person.fullName(),
      phone: faker.phone.number(),
      created_date: new Date(),
    }
  }

  async create() {
    const createUserRepository = new CreateUserRepository(this.dbConnection)
    return await createUserRepository.handle(this.makeOne())
  }

  async createMany(count: number) {
    const createManyUserRepository = new CreateManyUserRepository(this.dbConnection)
    return await createManyUserRepository.handle(this.makeMany(count))
  }
}
