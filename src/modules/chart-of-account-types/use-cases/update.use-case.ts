import type { ISchemaValidation, IUpdateOutput } from '@point-hub/papi'

import { ChartOfAccountTypeTypeEntity } from '../entity'
import { IUpdateChartOfAccountTypeRepository } from '../repositories/update.repository'
import { updateValidation } from '../validations/update.validation'

export interface IInput {
  _id: string
  data: {
    category_id?: string
    number?: string
    name?: string
    subledger?: string
    increasing_in?: string
  }
}
export interface IDeps {
  cleanObject(object: object): object
  schemaValidation: ISchemaValidation
  updateChartOfAccountTypeRepository: IUpdateChartOfAccountTypeRepository
}
export interface IOptions {
  session?: unknown
}

export class UpdateChartOfAccountTypeUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IUpdateOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, updateValidation)
    // 2. define entity
    const chartOfAccountTypeEntity = new ChartOfAccountTypeTypeEntity({
      name: input.data.name,
    })
    chartOfAccountTypeEntity.generateUpdatedDate()
    // 3. database operation
    const response = await deps.updateChartOfAccountTypeRepository.handle(
      input._id,
      chartOfAccountTypeEntity.data,
      options,
    )
    // 4. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
