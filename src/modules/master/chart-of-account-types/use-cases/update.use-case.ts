import { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import { ChartOfAccountTypeTypeEntity } from '../entity'
import { IUpdateChartOfAccountTypeRepository } from '../repositories/update.repository'
import { updateValidation } from '../validations/update.validation'

export interface IInput {
  _id: string
  data: {
    name?: string
  }
}

export interface IDeps {
  objClean: IObjClean
  schemaValidation: ISchemaValidation
  updateChartOfAccountTypeRepository: IUpdateChartOfAccountTypeRepository
}

export interface IOutput {
  matched_count: number
  modified_count: number
}

export class UpdateChartOfAccountTypeUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, updateValidation)
    // 2. define entity
    const typeEntity = new ChartOfAccountTypeTypeEntity({
      name: input.data.name,
    })
    typeEntity.generateDate('updated_date')
    // 3. database operation
    const response = await deps.updateChartOfAccountTypeRepository.handle(input._id, typeEntity.data)
    // 4. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
