import { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import { CounterEntity } from '../entity'
import { ICreateCounterRepository } from '../repositories/create.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  code?: string
  name?: string
}

export interface IDeps {
  objClean: IObjClean
  createCounterRepository: ICreateCounterRepository
  schemaValidation: ISchemaValidation
}

export interface IOutput {
  inserted_id: string
}

export class CreateCounterUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, createValidation)
    // 2. define entity
    const counterEntity = new CounterEntity({
      code: input.code,
      name: input.name,
    })
    counterEntity.generateDate('created_date')
    counterEntity.data = deps.objClean(counterEntity.data)
    // 3. database operation
    const response = await deps.createCounterRepository.handle(counterEntity)
    // 4. output
    return { inserted_id: response.inserted_id }
  }
}
