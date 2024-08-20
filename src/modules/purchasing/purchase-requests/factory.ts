import { faker } from '@faker-js/faker'
import { BaseFactory, type IDatabase } from '@point-hub/papi'

import { IPurchaseRequestEntity } from './interface'
import { CreatePurchaseRequestRepository } from './repositories/create.repository'
import { CreateManyPurchaseRequestRepository } from './repositories/create-many.repository'

export default class PurchaseRequestFactory extends BaseFactory<IPurchaseRequestEntity> {
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
    const createPurchaseRequestRepository = new CreatePurchaseRequestRepository(this.dbConnection)
    return await createPurchaseRequestRepository.handle(this.makeOne())
  }

  async createMany(count: number) {
    const createManyPurchaseRequestRepository = new CreateManyPurchaseRequestRepository(this.dbConnection)
    return await createManyPurchaseRequestRepository.handle(this.makeMany(count))
  }
}
