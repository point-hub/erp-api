import { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import { ChartOfAccountEntity } from '../entity'
import { IUpdateChartOfAccountRepository } from '../repositories/update.repository'
import { updateValidation } from '../validations/update.validation'

export interface IInput {
  _id: string
  data: {
    type_id?: string
    category_id?: string
    number?: string
    name?: string
    subledger?: string
    notes?: string
  }
}

export interface IDeps {
  objClean: IObjClean
  schemaValidation: ISchemaValidation
  updateChartOfAccountRepository: IUpdateChartOfAccountRepository
}

export interface IOutput {
  matched_count: number
  modified_count: number
}

export class UpdateChartOfAccountUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input.data, updateValidation)
    // 2. define entity
    const chartOfAccountEntity = new ChartOfAccountEntity({
      category_id: input.data.category_id,
      number: input.data.number,
      name: input.data.name,
      label: `[${input.data.number}] ${input.data.name}`,
      subledger: input.data.subledger ?? '',
      notes: input.data.notes ?? '',
    })
    chartOfAccountEntity.generateDate('updated_date')
    // 3. database operation
    const response = await deps.updateChartOfAccountRepository.handle(input._id, chartOfAccountEntity.data)
    // 4. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
