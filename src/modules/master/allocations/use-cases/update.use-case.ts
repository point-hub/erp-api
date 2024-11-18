import type { ISchemaValidation } from '@point-hub/papi'

import { IAuth } from '@/modules/master/users/interface'

import { AllocationEntity } from '../entity'
import { IUpdateAllocationRepository } from '../repositories/update.repository'
import { updateValidation } from '../validations/update.validation'

export interface IInput {
  auth: IAuth
  _id: string
  data: {
    allocation_group_id?: string
    code?: string
    name?: string
    notes?: string
    updated_by?: string
  }
}

export interface IDeps {
  schemaValidation: ISchemaValidation
  updateAllocationRepository: IUpdateAllocationRepository
}

export interface IOutput {
  matched_count: number
  modified_count: number
}

export class UpdateAllocationUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input.data, updateValidation)
    // 2. define entity
    const allocationEntity = new AllocationEntity({
      allocation_group_id: input.data.allocation_group_id,
      code: input.data.code,
      name: input.data.name,
      notes: input.data.notes ?? '',
      updated_by: input.auth._id,
    })
    allocationEntity.generateDate('updated_date')
    // 3. database operation
    const response = await deps.updateAllocationRepository.handle(input._id, allocationEntity.data, options)
    // 4. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
