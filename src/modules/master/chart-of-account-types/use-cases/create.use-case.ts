import { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import { ChartOfAccountTypeTypeEntity } from '../entity'
import { ICreateChartOfAccountTypeRepository } from '../repositories/create.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  name?: string
}

export interface IDeps {
  objClean: IObjClean
  createChartOfAccountTypeRepository: ICreateChartOfAccountTypeRepository
  schemaValidation: ISchemaValidation
}

export interface IOutput {
  inserted_id: string
}

export class CreateChartOfAccountTypeUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, createValidation)
    // 2. define entity
    const typeEntity = new ChartOfAccountTypeTypeEntity({
      name: input.name,
    })
    typeEntity.generateDate('created_date')
    const cleanEntity = deps.objClean(typeEntity.data)
    // 3. database operation
    const response = await deps.createChartOfAccountTypeRepository.handle(cleanEntity)
    // 4. output
    return { inserted_id: response.inserted_id }
  }
}
