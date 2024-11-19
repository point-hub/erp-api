import { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import { IUpdateMasterNumber } from '@/modules/counters/utils/update-master-number'
import { IAuth } from '@/modules/master/users/interface'

import { collectionName as allocationGroupCollectionName } from '../../allocation-groups/entity'
import { IRetrieveAllocationGroupRepository } from '../../allocation-groups/repositories/retrieve.repository'
import { AllocationEntity } from '../entity'
import { ICreateAllocationRepository } from '../repositories/create.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  auth: IAuth
  data: {
    allocation_group: {
      _id: string
      label: string
      code: string
    }
    code: string
    name: string
    notes?: string
  }
}

export interface IDeps {
  objClean: IObjClean
  createAllocationRepository: ICreateAllocationRepository
  retrieveAllocationGroupRepository: IRetrieveAllocationGroupRepository
  updateMasterNumber: IUpdateMasterNumber
  schemaValidation: ISchemaValidation
}

export interface IOutput {
  inserted_id: string
}

export class CreateAllocationUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input.data, createValidation)
    // 2. define entity
    const allocationEntity = new AllocationEntity({
      allocation_group: {
        _id: input.data.allocation_group._id,
        label: input.data.allocation_group.label,
        code: input.data.allocation_group.code,
      },
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
    allocationEntity.generateDate('created_date')
    allocationEntity.data = deps.objClean(allocationEntity.data)
    // 3. database operation
    // 3.1 create allocation
    const response = await deps.createAllocationRepository.handle(allocationEntity.data)
    // 3.2. update counter
    await deps.updateMasterNumber.handle(allocationGroupCollectionName, input.data.allocation_group.code)
    // 4. output
    return { inserted_id: response.inserted_id }
  }
}
