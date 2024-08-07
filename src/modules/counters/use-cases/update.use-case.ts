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
  cleanObject(object: object): object
  schemaValidation: ISchemaValidation
  updateCounterRepository: IUpdateCounterRepository
}
export interface IOptions {
  session?: unknown
}
export interface IOutput {
  matched_count: number
  modified_count: number
}

export class UpdateCounterUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, updateValidation)
    // 2. define entity
    const branchEntity = new CounterEntity({
      code: input.data.code,
      name: input.data.name,
    })
    branchEntity.generateUpdatedDate()
    // 3. database operation
    const response = await deps.updateCounterRepository.handle(input._id, branchEntity.data, options)
    // 4. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
