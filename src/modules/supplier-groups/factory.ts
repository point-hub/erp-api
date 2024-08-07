import { faker } from '@faker-js/faker'
import { BaseFactory, type IDatabase } from '@point-hub/papi'

import { ISupplierGroupEntity } from './interface'
import { CreateSupplierGroupRepository } from './repositories/create.repository'
import { CreateManySupplierGroupRepository } from './repositories/create-many.repository'

export default class SupplierGroupFactory extends BaseFactory<ISupplierGroupEntity> {
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
    const createSupplierGroupRepository = new CreateSupplierGroupRepository(this.dbConnection)
    return await createSupplierGroupRepository.handle(this.makeOne())
  }

  async createMany(count: number) {
    const createManyRepository = new CreateManySupplierGroupRepository(this.dbConnection)
    return await createManyRepository.handle(this.makeMany(count))
  }
}
