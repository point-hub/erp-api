import { BaseFactory, type IDatabase } from '@point-hub/papi'

import { IReceiveOrderEntity } from './interface'
import { CreateReceiveOrderRepository } from './repositories/create.repository'
import { CreateManyReceiveOrderRepository } from './repositories/create-many.repository'

export default class ReceiveOrderFactory extends BaseFactory<IReceiveOrderEntity> {
  constructor(public dbConnection: IDatabase) {
    super()
  }

  definition() {
    return {
      created_date: new Date(),
    }
  }

  async create() {
    const createReceiveOrderRepository = new CreateReceiveOrderRepository(this.dbConnection)
    return await createReceiveOrderRepository.handle(this.makeOne())
  }

  async createMany(count: number) {
    const createManyReceiveOrderRepository = new CreateManyReceiveOrderRepository(this.dbConnection)
    return await createManyReceiveOrderRepository.handle(this.makeMany(count))
  }
}
