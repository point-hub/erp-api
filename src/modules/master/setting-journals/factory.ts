import { BaseFactory, type IDatabase } from '@point-hub/papi'

import { ISettingJournalEntity } from './interface'
import { CreateSettingJournalRepository } from './repositories/create.repository'
import { CreateManySettingJournalRepository } from './repositories/create-many.repository'

export default class SettingJournalFactory extends BaseFactory<ISettingJournalEntity> {
  constructor(public dbConnection: IDatabase) {
    super()
  }

  definition() {
    return {
      created_date: new Date(),
    }
  }

  async create() {
    const createSettingJournalRepository = new CreateSettingJournalRepository(this.dbConnection)
    return await createSettingJournalRepository.handle(this.makeOne())
  }

  async createMany(count: number) {
    const createManySettingJournalRepository = new CreateManySettingJournalRepository(this.dbConnection)
    return await createManySettingJournalRepository.handle(this.makeMany(count))
  }
}
