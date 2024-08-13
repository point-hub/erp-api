import type { ISchemaValidation, IUpdateOutput } from '@point-hub/papi'

import { SettingJournalEntity } from '../entity'
import { IUpdateSettingJournalRepository } from '../repositories/update.repository'
import { updateValidation } from '../validations/update.validation'

export interface IInput {
  _id: string
  data: {
    branch_id?: string
    code?: string
    name?: string
  }
}
export interface IDeps {
  cleanObject(object: object): object
  schemaValidation: ISchemaValidation
  updateSettingJournalRepository: IUpdateSettingJournalRepository
}
export interface IOptions {
  session?: unknown
}

export class UpdateSettingJournalUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IUpdateOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, updateValidation)
    // 2. define entity
    const settingJournalEntity = new SettingJournalEntity({
      branch_id: input.data.branch_id,
      code: input.data.code,
      name: input.data.name,
    })
    settingJournalEntity.generateUpdatedDate()
    // 3. database operation
    const response = await deps.updateSettingJournalRepository.handle(input._id, settingJournalEntity.data, options)
    // 4. response
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
