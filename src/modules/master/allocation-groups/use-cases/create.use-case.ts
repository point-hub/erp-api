import { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import { IGenerateMasterNumber } from '@/modules/counters/utils/generate-master-number'
import { collectionName as allocationCollectionName } from '@/modules/master/allocations/entity'
import { IAuth } from '@/modules/master/users/interface'

import { AllocationGroupEntity } from '../entity'
import { ICreateAllocationGroupRepository } from '../repositories/create.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  auth: IAuth
  data: {
    code: string
    name: string
    notes?: string
  }
}

export interface IDeps {
  objClean: IObjClean
  createAllocationGroupRepository: ICreateAllocationGroupRepository
  generateMasterNumber: IGenerateMasterNumber
  schemaValidation: ISchemaValidation
}

export interface IOutput {
  inserted_id: string
}

export class CreateAllocationGroupUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input.data, createValidation)
    // 2. define entity
    const allocationGroupEntity = new AllocationGroupEntity({
      code: input.data.code,
      name: input.data.name,
      label: `[${input.data.code}] ${input.data.name}`,
      notes: input.data.notes,
      created_by: {
        _id: input.auth._id,
        label: input.auth.name,
        email: input.auth.email,
      },
    })
    allocationGroupEntity.generateDate('created_date')
    allocationGroupEntity.data = deps.objClean(allocationGroupEntity.data)
    // 3. database operation
    // 3.1 create allocation group
    const response = await deps.createAllocationGroupRepository.handle(allocationGroupEntity.data)
    // 3.2. update counter
    await deps.generateMasterNumber.handle(allocationCollectionName, input.data.code)
    // 4. output
    return { inserted_id: response.inserted_id }
  }
}
