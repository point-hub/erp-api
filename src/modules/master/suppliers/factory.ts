import { BaseFactory, type IDatabase } from '@point-hub/papi'

import { ISupplierEntity } from './interface'
import { CreateSupplierRepository } from './repositories/create.repository'
import { CreateManySupplierRepository } from './repositories/create-many.repository'

export default class SupplierFactory extends BaseFactory<ISupplierEntity> {
  constructor(public dbConnection: IDatabase) {
    super()
  }

  definition() {
    return {
      created_date: new Date(),
    }
  }

  async create() {
    const createSupplierRepository = new CreateSupplierRepository(this.dbConnection)
    return await createSupplierRepository.handle(this.makeOne())
  }

  async createMany(count: number) {
    const createManySupplierRepository = new CreateManySupplierRepository(this.dbConnection)
    return await createManySupplierRepository.handle(this.makeMany(count))
  }
}
