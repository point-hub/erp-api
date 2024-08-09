import type { ICreateOutput, ISchemaValidation } from '@point-hub/papi'

import { ChartOfAccountCategoryEntity } from '../entity'
import { ICreateChartOfAccountCategoryRepository } from '../repositories/create.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  type_id?: string
  name?: string
}
export interface IDeps {
  cleanObject(object: object): object
  createChartOfAccountCategoryRepository: ICreateChartOfAccountCategoryRepository
  schemaValidation: ISchemaValidation
}
export interface IOptions {
  session?: unknown
}

export class CreateChartOfAccountCategoryUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<ICreateOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, createValidation)
    // 2. define entity
    const exampleEntity = new ChartOfAccountCategoryEntity({
      type_id: input.type_id,
      name: input.name,
    })
    exampleEntity.generateCreatedDate()
    const cleanEntity = deps.cleanObject(exampleEntity.data)
    // 3. database operation
    const response = await deps.createChartOfAccountCategoryRepository.handle(cleanEntity, options)
    // 4. response
    return { inserted_id: response.inserted_id }
  }
}
