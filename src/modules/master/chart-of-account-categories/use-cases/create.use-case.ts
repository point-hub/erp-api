import { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import { ChartOfAccountCategoryEntity } from '../entity'
import { ICreateChartOfAccountCategoryRepository } from '../repositories/create.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  type_id?: string
  name?: string
}

export interface IDeps {
  objClean: IObjClean
  createChartOfAccountCategoryRepository: ICreateChartOfAccountCategoryRepository
  schemaValidation: ISchemaValidation
}

export interface IOutput {
  inserted_id: string
}

export class CreateChartOfAccountCategoryUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, createValidation)
    // 2. define entity
    const categoryEntity = new ChartOfAccountCategoryEntity({
      type_id: input.type_id,
      name: input.name,
    })
    categoryEntity.generateCreatedDate()
    const cleanEntity = deps.cleanObject(categoryEntity.data)
    // 3. database operation
    const response = await deps.createChartOfAccountCategoryRepository.handle(cleanEntity, options)
    // 4. output
    return { inserted_id: response.inserted_id }
  }
}
