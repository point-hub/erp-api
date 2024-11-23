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
    updated_by?: {
      _id: string
      label: string
      email: string
    }
  }
}

export interface IDeps {
  schemaValidation: ISchemaValidation
  updateAllocationGroupRepository: IUpdateAllocationGroupRepository
}

export interface IOutput {
  matched_count: number
  modified_count: number
}

export class UpdateAllocationGroupUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input.data, updateValidation)
    // 2. define entity
    const allocationGroupEntity = new AllocationGroupEntity({
      code: input.data.code,
      name: input.data.name,
      label: `[${input.data.code}] ${input.data.name}`,
      notes: input.data.notes ?? '',
      updated_by: {
        _id: input.auth._id,
        label: input.auth.name,
        email: input.auth.email,
      },
    })
    allocationGroupEntity.generateDate('updated_date')
    // 3. database operation
    const response = await deps.updateAllocationGroupRepository.handle(input._id, allocationGroupEntity.data)
    // 4. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
