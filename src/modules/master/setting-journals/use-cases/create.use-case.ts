import { IObjClean } from '@point-hub/express-utils'
import type { ICreateOutput, ISchemaValidation } from '@point-hub/papi'

import { IRetrieveAllCounterRepository } from '@/modules/counters/repositories/retrieve-all.repository'
import { IUpdateCounterRepository } from '@/modules/counters/repositories/update.repository'

import { SettingJournalEntity } from '../entity'
import { ICreateSettingJournalRepository } from '../repositories/create.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  module?: string
  feature?: string
}

export interface IDeps {
  objClean: IObjClean
  createSettingJournalRepository: ICreateSettingJournalRepository
  retrieveAllCounterRepository: IRetrieveAllCounterRepository
  updateCounterRepository: IUpdateCounterRepository
  schemaValidation: ISchemaValidation
}

export class CreateSettingJournalUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<ICreateOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, createValidation)
    // 2. define entity
    const settingJournalEntity = new SettingJournalEntity({
      module: input.module,
      feature: input.feature,
    })
    settingJournalEntity.generateDate('created_date')
    settingJournalEntity.data = deps.objClean(settingJournalEntity.data)
    // 3. database operation
    // 3.1 create setting journal
    const response = await deps.createSettingJournalRepository.handle(settingJournalEntity.data)
    // 3.2. update code counter
    const counters = await deps.retrieveAllCounterRepository.handle({ filter: { name: 'setting-journal' } })
    await deps.updateCounterRepository.handle(counters.data[0]._id, { count: Number(counters.data[0].count) + 1 })
    // 4. output
    return { inserted_id: response.inserted_id }
  }
}
