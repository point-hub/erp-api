import { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import { IRetrieveAllCounterRepository } from '@/modules/counters/repositories/retrieve-all.repository'
import { IUpdateCounterRepository } from '@/modules/counters/repositories/update.repository'
import { IAuth } from '@/modules/master/users/interface'

import { IRetrieveAllocationGroupRepository } from '../../allocation-groups/repositories/retrieve.repository'
import { AllocationEntity } from '../entity'
import { ICreateAllocationRepository } from '../repositories/create.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  auth: IAuth
  data: {
    allocation_group_id?: string
    code?: string
    name?: string
    notes?: string
  }
}
export interface IDeps {
  objClean: IObjClean
  createAllocationRepository: ICreateAllocationRepository
  retrieveAllocationGroupRepository: IRetrieveAllocationGroupRepository
  retrieveAllCounterRepository: IRetrieveAllCounterRepository
  updateCounterRepository: IUpdateCounterRepository
  schemaValidation: ISchemaValidation
}
export interface IOptions {
  session?: unknown
}
export interface IOutput {
  inserted_id: string
}

export class CreateAllocationUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input.data, createValidation)
    // 2. define entity
    const allocationEntity = new AllocationEntity({
      allocation_group_id: input.data.allocation_group_id,
      code: input.data.code,
      name: input.data.name,
      notes: input.data.notes ?? '',
      created_by: input.auth._id,
    })
    allocationEntity.generateCreatedDate()
    const cleanEntity = deps.cleanObject(allocationEntity.data)
    // 3. database operation
    // 3.1 create allocation
    const response = await deps.createAllocationRepository.handle(cleanEntity, options)
    // 3.2. update counter
    const allocationGroup = deps.retrieveAllocationGroupRepository.handle(
      allocationEntity.data.allocation_group_id as string,
      options,
    )
    const counters = await deps.retrieveAllCounterRepository.handle(
      { filter: { name: 'allocation_groups', code: (await allocationGroup).code } },
      options,
    )
    await deps.updateCounterRepository.handle(
      counters.data[0]._id,
      { count: Number(counters.data[0].count) + 1 },
      options,
    )
    // 4. output
    return { inserted_id: response.inserted_id }
  }
}
