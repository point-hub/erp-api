import { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import { ChartOfAccountEntity } from '../entity'
import { ICreateChartOfAccountRepository } from '../repositories/create.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  type_id?: string
  category_id?: string
  number?: string
  name?: string
  subledger?: string
  notes?: string
}

export interface IDeps {
  objClean: IObjClean
  createChartOfAccountRepository: ICreateChartOfAccountRepository
  schemaValidation: ISchemaValidation
}

export interface IOutput {
  inserted_id: string
}

export class CreateChartOfAccountUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, createValidation)
    // 2. define entity
    const exampleEntity = new ChartOfAccountEntity({
      type_id: input.type_id,
      category_id: input.category_id,
      number: input.number,
      name: input.name,
      subledger: input.subledger,
      notes: input.notes,
    })
    exampleEntity.generateDate('created_date')
    const cleanEntity = deps.objClean(exampleEntity.data)
    // 3. database operation
    const response = await deps.createChartOfAccountRepository.handle(cleanEntity)
    // 4. output
    return { inserted_id: response.inserted_id }
  }
}
