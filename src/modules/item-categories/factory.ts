import { faker } from '@faker-js/faker'
import { BaseFactory, type IDatabase } from '@point-hub/papi'

import { IItemCategoryEntity } from './interface'
import { CreateItemCategoryRepository } from './repositories/create.repository'
import { CreateManyItemCategoryRepository } from './repositories/create-many.repository'

export default class ItemCategoryFactory extends BaseFactory<IItemCategoryEntity> {
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
    const createItemCategoryRepository = new CreateItemCategoryRepository(this.dbConnection)
    return await createItemCategoryRepository.handle(this.makeOne())
  }

  async createMany(count: number) {
    const createManyRepository = new CreateManyItemCategoryRepository(this.dbConnection)
    return await createManyRepository.handle(this.makeMany(count))
  }
}
