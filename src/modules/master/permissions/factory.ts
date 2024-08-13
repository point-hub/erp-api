import { faker } from '@faker-js/faker'
import { BaseFactory, type IDatabase } from '@point-hub/papi'

import { IPermissionEntity } from './interface'
import { CreatePermissionRepository } from './repositories/create.repository'
import { CreateManyPermissionRepository } from './repositories/create-many.repository'

export default class PermissionFactory extends BaseFactory<IPermissionEntity> {
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
    const createPermissionRepository = new CreatePermissionRepository(this.dbConnection)
    return await createPermissionRepository.handle(this.makeOne())
  }

  async createMany(count: number) {
    const createManyPermissionRepository = new CreateManyPermissionRepository(this.dbConnection)
    return await createManyPermissionRepository.handle(this.makeMany(count))
  }
}
