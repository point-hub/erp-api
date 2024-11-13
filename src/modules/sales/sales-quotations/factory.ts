import { faker } from '@faker-js/faker'
import { BaseFactory, type IDatabase } from '@point-hub/papi'

import { ISalesQuotationEntity } from './interface'
import { CreateSalesQuotationRepository } from './repositories/create.repository'
import { CreateManySalesQuotationRepository } from './repositories/create-many.repository'

export default class SalesQuotationFactory extends BaseFactory<ISalesQuotationEntity> {
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
    const createSalesQuotationRepository = new CreateSalesQuotationRepository(this.dbConnection)
    return await createSalesQuotationRepository.handle(this.makeOne())
  }

  async createMany(count: number) {
    const createManySalesQuotationRepository = new CreateManySalesQuotationRepository(this.dbConnection)
    return await createManySalesQuotationRepository.handle(this.makeMany(count))
  }
}
