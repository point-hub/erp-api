import type { ICreateOutput, ICreateRepository, ISchemaValidation } from '@point-hub/papi'

import { ChartOfAccountEntity } from '../entity'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  name?: string
  phone?: string
}
export interface IDeps {
  cleanObject(object: object): object
  createRepository: ICreateRepository
  schemaValidation: ISchemaValidation
}
export interface IOptions {
  session?: unknown
}

export class CreateChartOfAccountUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<ICreateOutput> {
    // 1. define entity
    const chartOfAccountEntity = new ChartOfAccountEntity({
      name: input.name,
      phone: input.phone,
    })
    chartOfAccountEntity.generateCreatedDate()
    const cleanEntity = deps.cleanObject(chartOfAccountEntity.data)
    // 2. validate schema
    await deps.schemaValidation(cleanEntity, createValidation)
    // 3. database operation
    const response = await deps.createRepository.handle(cleanEntity, options)
    return { inserted_id: response.inserted_id }
  }
}
