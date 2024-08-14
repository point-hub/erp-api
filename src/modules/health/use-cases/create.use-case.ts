import type { ISchemaValidation } from '@point-hub/papi'

import { HealthEntity } from '../entity'
import { ICreateHealthRepository } from '../repositories/create.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  code?: string
  name?: string
}
export interface IDeps {
  cleanObject(object: object): object
  createHealthRepository: ICreateHealthRepository
  schemaValidation: ISchemaValidation
}
export interface IOptions {
  session?: unknown
}

export interface IOutput {
  inserted_id: string
}

export class CreateHealthUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, createValidation)
    // 2. define entity
    const healthEntity = new HealthEntity({
      code: input.code,
      name: input.name,
    })
    healthEntity.generateCreatedDate()
    const cleanEntity = deps.cleanObject(healthEntity.data)
    // 3. database operation
    const response = await deps.createHealthRepository.handle(cleanEntity, options)
    // 4. output
    return { inserted_id: response.inserted_id }
  }
}
