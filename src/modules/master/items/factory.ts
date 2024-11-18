import { BaseFactory, type IDatabase } from '@point-hub/papi'

import { IItemEntity } from './interface'
import { CreateItemRepository } from './repositories/create.repository'
import { CreateManyItemRepository } from './repositories/create-many.repository'

export default class ItemFactory extends BaseFactory<IItemEntity> {
  constructor(public dbConnection: IDatabase) {
    super()
  }

  definition() {
    return {
      created_date: new Date(),
    }
  }

  async create() {
    const createItemRepository = new CreateItemRepository(this.dbConnection)
    return await createItemRepository.handle(this.makeOne())
  }

  async createMany(count: number) {
    const createManyItemRepository = new CreateManyItemRepository(this.dbConnection)
    return await createManyItemRepository.handle(this.makeMany(count))
  }
}
