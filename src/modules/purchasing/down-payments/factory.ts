import { BaseFactory, type IDatabase } from '@point-hub/papi'

import { IDownPaymentEntity } from './interface'
import { CreateDownPaymentRepository } from './repositories/create.repository'
import { CreateManyDownPaymentRepository } from './repositories/create-many.repository'

export default class DownPaymentFactory extends BaseFactory<IDownPaymentEntity> {
  constructor(public dbConnection: IDatabase) {
    super()
  }

  definition() {
    return {
      created_date: new Date(),
    }
  }

  async create() {
    const createDownPaymentRepository = new CreateDownPaymentRepository(this.dbConnection)
    return await createDownPaymentRepository.handle(this.makeOne())
  }

  async createMany(count: number) {
    const createManyDownPaymentRepository = new CreateManyDownPaymentRepository(this.dbConnection)
    return await createManyDownPaymentRepository.handle(this.makeMany(count))
  }
}
