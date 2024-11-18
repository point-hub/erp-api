import { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation, IUpdateOutput, TypeCodeStatus } from '@point-hub/papi'

import type { IOptions as IOptionsApiError } from '@/utils/throw-api-error'

import { SettingJournalEntity } from '../entity'
import { IUpdateSettingJournalRepository } from '../repositories/update.repository'
import { updateValidation } from '../validations/update.validation'

export interface IInput {
  _id: string
  data: {
    module?: string
    feature?: string
    journals?: { [key: string]: string }[]
  }
}
export interface IDeps {
  objClean: IObjClean
  schemaValidation: ISchemaValidation
  updateSettingJournalRepository: IUpdateSettingJournalRepository
  throwApiError(codeStatus: TypeCodeStatus, options: IOptionsApiError): void
}
export interface IOptions {
  session?: unknown
}

export class UpdateSettingJournalUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IUpdateOutput> {
    // 1. validate schema
    await deps.schemaValidation(input.data, updateValidation)
    const errors: { [key: string]: string[] } = {}
    if (input.data.journals) {
      for (let index = 0; index < input.data.journals.length; index++) {
        if (input.data.journals[index].editable && !input.data.journals[index].chart_of_account_id) {
          const key = `journals.${index}.chart_of_account_id`
          errors[key] = [`The chart of account field is required.`]
        }
      }
      if (Object.keys(errors).length > 0) {
        deps.throwApiError(422, {
          errors: errors,
        })
      }
    }

    // 2. define entity
    const settingJournalEntity = new SettingJournalEntity({
      module: input.data.module,
      feature: input.data.feature,
      journals: input.data.journals,
    })
    settingJournalEntity.generateUpdatedDate()
    // 3. database operation
    const response = await deps.updateSettingJournalRepository.handle(input._id, settingJournalEntity.data, options)
    // 4. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
