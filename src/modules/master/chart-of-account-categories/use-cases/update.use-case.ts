import type { ISchemaValidation, IUpdateOutput } from '@point-hub/papi'

import { ChartOfAccountCategoryEntity } from '../entity'
import { IUpdateChartOfAccountCategoryRepository } from '../repositories/update.repository'
import { updateValidation } from '../validations/update.validation'

export interface IInput {
  _id: string
  data: {
    category_id?: string
    number?: string
    name?: string
    subledger?: string
  }
}
export interface IDeps {
  cleanObject(object: object): object
  schemaValidation: ISchemaValidation
  updateChartOfAccountCategoryRepository: IUpdateChartOfAccountCategoryRepository
}
export interface IOptions {
  session?: unknown
}

export class UpdateChartOfAccountCategoryUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IUpdateOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, updateValidation)
    // 2. define entity
    const chartOfAccountCategoryEntity = new ChartOfAccountCategoryEntity({
      name: input.data.name,
    })
    chartOfAccountCategoryEntity.generateUpdatedDate()
    // 3. database operation
    const response = await deps.updateChartOfAccountCategoryRepository.handle(
      input._id,
      chartOfAccountCategoryEntity.data,
      options,
    )
    // 4. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
