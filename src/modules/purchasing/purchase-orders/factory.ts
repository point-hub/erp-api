import { faker } from '@faker-js/faker'
import { BaseFactory, type IDatabase } from '@point-hub/papi'

import { IPurchaseOrderEntity } from './interface'
import { CreatePurchaseOrderRepository } from './repositories/create.repository'
import { CreateManyPurchaseOrderRepository } from './repositories/create-many.repository'

export default class PurchaseOrderFactory extends BaseFactory<IPurchaseOrderEntity> {
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
    const createPurchaseOrderRepository = new CreatePurchaseOrderRepository(this.dbConnection)
    return await createPurchaseOrderRepository.handle(this.makeOne())
  }

  async createMany(count: number) {
    const createManyPurchaseOrderRepository = new CreateManyPurchaseOrderRepository(this.dbConnection)
    return await createManyPurchaseOrderRepository.handle(this.makeMany(count))
  }
}
