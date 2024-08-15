import type { ICreateOutput, ISchemaValidation } from '@point-hub/papi'

import { IRetrieveAllCounterRepository } from '@/modules/counters/repositories/retrieve-all.repository'
import { IUpdateCounterRepository } from '@/modules/counters/repositories/update.repository'

import { AllocationEntity } from '../entity'
import { ICreateAllocationRepository } from '../repositories/create.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  allocation_group_id?: string
  code?: string
  name?: string
}
export interface IDeps {
  cleanObject(object: object): object
  createAllocationRepository: ICreateAllocationRepository
  retrieveAllCounterRepository: IRetrieveAllCounterRepository
  updateCounterRepository: IUpdateCounterRepository
  schemaValidation: ISchemaValidation
}
export interface IOptions {
  session?: unknown
}

export class CreateAllocationUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<ICreateOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, createValidation)
    // 2. define entity
    const exampleEntity = new AllocationEntity({
      allocation_group_id: input.allocation_group_id,
      code: input.code,
      name: input.name,
    })
    exampleEntity.generateCreatedDate()
    const cleanEntity = deps.cleanObject(exampleEntity.data)
    // 3. database operation
    // 3.1 create allocation
    const response = await deps.createAllocationRepository.handle(cleanEntity, options)
    // 3.2. update code counter
    const counters = await deps.retrieveAllCounterRepository.handle({ filter: { name: 'allocation-code' } }, options)
    await deps.updateCounterRepository.handle(
      counters.data[0]._id,
      { count: Number(counters.data[0].count) + 1 },
      options,
    )
    // 4. output
    return { inserted_id: response.inserted_id }
  }
}
