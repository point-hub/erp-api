import { BaseFactory, type IDatabase } from '@point-hub/papi'

import { IAllocationEntity } from './interface'
import { CreateAllocationRepository } from './repositories/create.repository'
import { CreateManyAllocationRepository } from './repositories/create-many.repository'

export default class AllocationFactory extends BaseFactory<IAllocationEntity> {
  constructor(public dbConnection: IDatabase) {
    super()
  }

  definition() {
    return {
      created_date: new Date(),
    }
  }

  async create() {
    const createAllocationRepository = new CreateAllocationRepository(this.dbConnection)
    return await createAllocationRepository.handle(this.makeOne())
  }

  async createMany(count: number) {
    const createManyAllocationRepository = new CreateManyAllocationRepository(this.dbConnection)
    return await createManyAllocationRepository.handle(this.makeMany(count))
  }
}
