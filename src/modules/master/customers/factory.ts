import { BaseFactory, type IDatabase } from '@point-hub/papi'

import { ICustomerEntity } from './interface'
import { CreateCustomerRepository } from './repositories/create.repository'
import { CreateManyCustomerRepository } from './repositories/create-many.repository'

export default class CustomerFactory extends BaseFactory<ICustomerEntity> {
  constructor(public dbConnection: IDatabase) {
    super()
  }

  definition() {
    return {
      created_date: new Date(),
    }
  }

  async create() {
    const createCustomerRepository = new CreateCustomerRepository(this.dbConnection)
    return await createCustomerRepository.handle(this.makeOne())
  }

  async createMany(count: number) {
    const createManyCustomerRepository = new CreateManyCustomerRepository(this.dbConnection)
    return await createManyCustomerRepository.handle(this.makeMany(count))
  }
}
