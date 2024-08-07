import type { ISchemaValidation } from '@point-hub/papi'

import { BranchEntity } from '../entity'
import { ICreateCounterRepository } from '../repositories/create.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  code?: string
  name?: string
}
export interface IDeps {
  cleanObject(object: object): object
  createRepository: ICreateCounterRepository
  schemaValidation: ISchemaValidation
}
export interface IOptions {
  session?: unknown
}

export interface IOutput {
  inserted_id: string
}

export class CreateBranchUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, createValidation)
    // 2. define entity
    const counterEntity = new BranchEntity({
      code: input.code,
      name: input.name,
    })
    counterEntity.generateCreatedDate()
    const cleanEntity = deps.cleanObject(counterEntity.data)
    // 3. database operation
    const response = await deps.createRepository.handle(cleanEntity, options)
    // 4. output
    return { inserted_id: response.inserted_id }
  }
}
