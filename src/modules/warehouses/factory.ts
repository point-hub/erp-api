import { faker } from '@faker-js/faker'
import { BaseFactory, type IDatabase } from '@point-hub/papi'

import { IWarehouseEntity } from './interface'
import { CreateWarehouseRepository } from './repositories/create.repository'
import { CreateManyWarehouseRepository } from './repositories/create-many.repository'

export default class WarehouseFactory extends BaseFactory<IWarehouseEntity> {
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
    const createWarehouseRepository = new CreateWarehouseRepository(this.dbConnection)
    return await createWarehouseRepository.handle(this.makeOne())
  }

  async createMany(count: number) {
    const createManyWarehouseRepository = new CreateManyWarehouseRepository(this.dbConnection)
    return await createManyWarehouseRepository.handle(this.makeMany(count))
  }
}
