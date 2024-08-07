import type { ICreateOutput, ISchemaValidation } from '@point-hub/papi'

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

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IOutput extends ICreateOutput {}

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
    // 3.1 create allocation group
    const response = await deps.createRepository.handle(cleanEntity, options)
    // response
    return { inserted_id: response.inserted_id }
  }
}
