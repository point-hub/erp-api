import type { ICreateOutput, ISchemaValidation } from '@point-hub/papi'

import { ChartOfAccountEntity } from '../entity'
import { ICreateChartOfAccountRepository } from '../repositories/create.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  type_id?: string
  category_id?: string
  number?: string
  name?: string
  subledger?: string
  increasing_in?: string
}
export interface IDeps {
  cleanObject(object: object): object
  createChartOfAccountRepository: ICreateChartOfAccountRepository
  schemaValidation: ISchemaValidation
}
export interface IOptions {
  session?: unknown
}

export class CreateChartOfAccountUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<ICreateOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, createValidation)
    // 2. define entity
    const exampleEntity = new ChartOfAccountEntity({
      type_id: input.type_id,
      category_id: input.category_id,
      number: Number(input.number) ? Number(input.number) : undefined,
      name: input.name,
      increasing_in: input.increasing_in,
      subledger: input.subledger,
    })
    exampleEntity.generateCreatedDate()
    const cleanEntity = deps.cleanObject(exampleEntity.data)
    // 3. database operation
    const response = await deps.createChartOfAccountRepository.handle(cleanEntity, options)
    // 4. response
    return { inserted_id: response.inserted_id }
  }
}
