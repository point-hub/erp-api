import type { ISchemaValidation } from '@point-hub/papi'

import { ChartOfAccountTypeTypeEntity } from '../entity'
import { ICreateChartOfAccountTypeRepository } from '../repositories/create.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  name?: string
}
export interface IDeps {
  cleanObject(object: object): object
  createChartOfAccountTypeRepository: ICreateChartOfAccountTypeRepository
  schemaValidation: ISchemaValidation
}
export interface IOptions {
  session?: unknown
}
export interface IOutput {
  inserted_id: string
}

export class CreateChartOfAccountTypeUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, createValidation)
    // 2. define entity
    const typeEntity = new ChartOfAccountTypeTypeEntity({
      name: input.name,
    })
    typeEntity.generateCreatedDate()
    const cleanEntity = deps.cleanObject(typeEntity.data)
    // 3. database operation
    const response = await deps.createChartOfAccountTypeRepository.handle(cleanEntity, options)
    // 4. output
    return { inserted_id: response.inserted_id }
  }
}
