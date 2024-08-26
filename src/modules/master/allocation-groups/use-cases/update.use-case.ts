import type { ISchemaValidation } from '@point-hub/papi'

import { IAuth } from '@/modules/master/users/interface'

import { AllocationGroupEntity } from '../entity'
import { IUpdateAllocationGroupRepository } from '../repositories/update.repository'
import { updateValidation } from '../validations/update.validation'

export interface IInput {
  auth: IAuth
  _id: string
  data: {
    code?: string
    name?: string
    notes?: string
    updated_by?: string
  }
}
export interface IDeps {
  schemaValidation: ISchemaValidation
  updateAllocationGroupRepository: IUpdateAllocationGroupRepository
}
export interface IOptions {
  session?: unknown
}
export interface IOutput {
  matched_count: number
  modified_count: number
}

export class UpdateAllocationGroupUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input.data, updateValidation)
    // 2. define entity
    const allocationGroupEntity = new AllocationGroupEntity({
      code: input.data.code,
      name: input.data.name,
      notes: input.data.notes ?? '',
      updated_by: input.auth._id,
    })
    allocationGroupEntity.generateUpdatedDate()
    // 3. database operation
    const response = await deps.updateAllocationGroupRepository.handle(input._id, allocationGroupEntity.data, options)
    // 4. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
