import { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import { ChartOfAccountCategoryEntity } from '../entity'
import { IUpdateChartOfAccountCategoryRepository } from '../repositories/update.repository'
import { updateValidation } from '../validations/update.validation'

export interface IInput {
  _id: string
  data: {
    type_id?: string
    name?: string
  }
}

export interface IDeps {
  objClean: IObjClean
  schemaValidation: ISchemaValidation
  updateChartOfAccountCategoryRepository: IUpdateChartOfAccountCategoryRepository
}

export interface IOutput {
  matched_count: number
  modified_count: number
}

export class UpdateChartOfAccountCategoryUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, updateValidation)
    // 2. define entity
    const chartOfAccountCategoryEntity = new ChartOfAccountCategoryEntity({
      type_id: input.data.type_id,
      name: input.data.name,
    })
    chartOfAccountCategoryEntity.generateDate('updated_date')
    // 3. database operation
    const response = await deps.updateChartOfAccountCategoryRepository.handle(
      input._id,
      chartOfAccountCategoryEntity.data,
    )
    // 4. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
