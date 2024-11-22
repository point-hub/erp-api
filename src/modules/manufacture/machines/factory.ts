import { BaseFactory, type IDatabase } from '@point-hub/papi'

import { IMachineEntity } from './interface'
import { CreateMachineRepository } from './repositories/create.repository'
import { CreateManyMachineRepository } from './repositories/create-many.repository'

export default class MachineFactory extends BaseFactory<IMachineEntity> {
  constructor(public dbConnection: IDatabase) {
    super()
  }

  definition() {
    return {
      created_date: new Date(),
    }
  }

  async create() {
    const createMachineRepository = new CreateMachineRepository(this.dbConnection)
    return await createMachineRepository.handle(this.makeOne())
  }

  async createMany(count: number) {
    const createManyMachineRepository = new CreateManyMachineRepository(this.dbConnection)
    return await createManyMachineRepository.handle(this.makeMany(count))
  }
}
