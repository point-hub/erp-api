import { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import { CounterEntity } from '../entity'
import { IUpdateCounterRepository } from '../repositories/update.repository'
import { updateValidation } from '../validations/update.validation'

export interface IInput {
  _id: string
  data: {
    code?: string
    name?: string
  }
}

export interface IDeps {
  objClean: IObjClean
  schemaValidation: ISchemaValidation
  updateCounterRepository: IUpdateCounterRepository
}

export interface IOutput {
  matched_count: number
  modified_count: number
}

export class UpdateCounterUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, updateValidation)
    // 2. define entity
    const counterEntity = new CounterEntity({
      code: input.data.code,
      name: input.data.name,
    })
    counterEntity.generateDate('updated_date')
    counterEntity.data = deps.objClean(counterEntity.data)
    // 3. database operation
    const response = await deps.updateCounterRepository.handle(input._id, counterEntity.data)
    // 4. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
