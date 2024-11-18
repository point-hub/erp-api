import { BaseFactory, type IDatabase } from '@point-hub/papi'

import { IBranchEntity } from './interface'
import { CreateBranchRepository } from './repositories/create.repository'
import { CreateManyBranchRepository } from './repositories/create-many.repository'

export default class BranchFactory extends BaseFactory<IBranchEntity> {
  constructor(public dbConnection: IDatabase) {
    super()
  }

  definition() {
    return {
      created_date: new Date(),
    }
  }

  async create() {
    const createBranchRepository = new CreateBranchRepository(this.dbConnection)
    return await createBranchRepository.handle(this.makeOne())
  }

  async createMany(count: number) {
    const createManyBranchRepository = new CreateManyBranchRepository(this.dbConnection)
    return await createManyBranchRepository.handle(this.makeMany(count))
  }
}
