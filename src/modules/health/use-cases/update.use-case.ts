import type { ISchemaValidation } from '@point-hub/papi'

import { HealthEntity } from '../entity'
import { IUpdateHealthRepository } from '../repositories/update.repository'
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
  updateHealthRepository: IUpdateHealthRepository
}
export interface IOptions {
  session?: unknown
}
export interface IOutput {
  matched_count: number
  modified_count: number
}

export class UpdateHealthUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, updateValidation)
    // 2. define entity
    const branchEntity = new HealthEntity({
      code: input.data.code,
      name: input.data.name,
    })
    branchEntity.generateUpdatedDate()
    // 3. database operation
    const response = await deps.updateHealthRepository.handle(input._id, branchEntity.data, options)
    // 4. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
