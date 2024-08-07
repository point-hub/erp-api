import { faker } from '@faker-js/faker'
import { BaseFactory, type IDatabase } from '@point-hub/papi'

import { IRoleEntity } from './interface'
import { CreateRoleRepository } from './repositories/create.repository'
import { CreateManyRoleRepository } from './repositories/create-many.repository'

export default class RoleFactory extends BaseFactory<IRoleEntity> {
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
    const createRoleRepository = new CreateRoleRepository(this.dbConnection)
    return await createRoleRepository.handle(this.makeOne())
  }

  async createMany(count: number) {
    const createManyRoleRepository = new CreateManyRoleRepository(this.dbConnection)
    return await createManyRoleRepository.handle(this.makeMany(count))
  }
}
