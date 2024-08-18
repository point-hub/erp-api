import { faker } from '@faker-js/faker'
import { BaseFactory, type IDatabase } from '@point-hub/papi'

import { IAllocationGroupEntity } from './interface'
import { CreateAllocationGroupRepository } from './repositories/create.repository'
import { CreateManyAllocationGroupRepository } from './repositories/create-many.repository'

export default class AllocationGroupFactory extends BaseFactory<IAllocationGroupEntity> {
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
    const createAllocationGroupRepository = new CreateAllocationGroupRepository(this.dbConnection)
    return await createAllocationGroupRepository.handle(this.makeOne())
  }

  async createMany(count: number) {
    const createManyRepository = new CreateManyAllocationGroupRepository(this.dbConnection)
    return await createManyRepository.handle(this.makeMany(count))
  }
}
