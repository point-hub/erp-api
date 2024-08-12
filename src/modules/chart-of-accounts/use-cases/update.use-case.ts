import type { ISchemaValidation, IUpdateOutput } from '@point-hub/papi'

import { ChartOfAccountEntity } from '../entity'
import { IUpdateChartOfAccountRepository } from '../repositories/update.repository'
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
  updateChartOfAccountRepository: IUpdateChartOfAccountRepository
}
export interface IOptions {
  session?: unknown
}

export class UpdateChartOfAccountUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IUpdateOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, updateValidation)
    // 2. define entity
    const chartOfAccountEntity = new ChartOfAccountEntity({
      category_id: input.data.category_id,
      number: Number(input.data.number),
      name: input.data.name,
      subledger: input.data.subledger,
    })
    chartOfAccountEntity.generateUpdatedDate()
    // 3. database operation
    const response = await deps.updateChartOfAccountRepository.handle(input._id, chartOfAccountEntity.data, options)
    // 4. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
