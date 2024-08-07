import type { ISchemaValidation } from '@point-hub/papi'

import { AllocationGroupEntity } from '../entity'
import { ICreateAllocationGroupRepository } from '../repositories/create.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  code?: string
  name?: string
}
export interface IDeps {
  cleanObject(object: object): object
  createRepository: ICreateAllocationGroupRepository
  schemaValidation: ISchemaValidation
}
export interface IOptions {
  session?: unknown
}
export interface IOutput {
  inserted_id: string
}

export class CreateAllocationGroupUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, createValidation)
    // 2. define entity
    const allocationGroupEntity = new AllocationGroupEntity({
      code: input.code,
      name: input.name,
    })
    allocationGroupEntity.generateCreatedDate()
    const cleanEntity = deps.cleanObject(allocationGroupEntity.data)
    // 3. database operation
    const response = await deps.createRepository.handle(cleanEntity, options)
    // output
    return { inserted_id: response.inserted_id }
  }
}
