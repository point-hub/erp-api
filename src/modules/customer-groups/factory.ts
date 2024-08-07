import { faker } from '@faker-js/faker'
import { BaseFactory, type IDatabase } from '@point-hub/papi'

import { ICustomerGroupEntity } from './interface'
import { CreateCustomerGroupRepository } from './repositories/create.repository'
import { CreateManyCustomerGroupRepository } from './repositories/create-many.repository'

export default class CustomerGroupFactory extends BaseFactory<ICustomerGroupEntity> {
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
    const createCustomerGroupRepository = new CreateCustomerGroupRepository(this.dbConnection)
    return await createCustomerGroupRepository.handle(this.makeOne())
  }

  async createMany(count: number) {
    const createManyRepository = new CreateManyCustomerGroupRepository(this.dbConnection)
    return await createManyRepository.handle(this.makeMany(count))
  }
}
