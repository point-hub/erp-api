import { BaseFactory, type IDatabase } from '@point-hub/papi'

import { IPurchaseInvoiceEntity } from './interface'
import { CreatePurchaseInvoiceRepository } from './repositories/create.repository'
import { CreateManyPurchaseInvoiceRepository } from './repositories/create-many.repository'

export default class PurchaseInvoiceFactory extends BaseFactory<IPurchaseInvoiceEntity> {
  constructor(public dbConnection: IDatabase) {
    super()
  }

  definition() {
    return {
      created_date: new Date(),
    }
  }

  async create() {
    const createPurchaseInvoiceRepository = new CreatePurchaseInvoiceRepository(this.dbConnection)
    return await createPurchaseInvoiceRepository.handle(this.makeOne())
  }

  async createMany(count: number) {
    const createManyPurchaseInvoiceRepository = new CreateManyPurchaseInvoiceRepository(this.dbConnection)
    return await createManyPurchaseInvoiceRepository.handle(this.makeMany(count))
  }
}
