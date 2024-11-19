import { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import { IUpdateMasterNumber } from '@/modules/counters/utils/update-master-number'
import { IAuth } from '@/modules/master/users/interface'

import { BranchEntity, collectionName } from '../entity'
import { ICreateBranchRepository } from '../repositories/create.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  auth: IAuth
  data: {
    code: string
    name: string
    address?: string
    phone?: string
    notes?: string
  }
}

export interface IDeps {
  objClean: IObjClean
  createBranchRepository: ICreateBranchRepository
  updateMasterNumber: IUpdateMasterNumber
  schemaValidation: ISchemaValidation
}

export interface IOutput {
  inserted_id: string
}

export class CreateBranchUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input.data, createValidation)
    // 2. define entity
    const branchEntity = new BranchEntity({
      code: input.data.code,
      name: input.data.name,
      address: input.data.address,
      phone: input.data.phone,
      notes: input.data.notes,
      created_by: input.auth._id,
    })
    branchEntity.generateDate('created_date')
    const cleanEntity = deps.objClean(branchEntity.data)
    // 3. database operation
    // 3.1 create branch
    const response = await deps.createBranchRepository.handle(cleanEntity)
    // 3.2. update counter
    await deps.updateMasterNumber.handle(collectionName, input.data.code)
    // 4. output
    return { inserted_id: response.inserted_id }
  }
}
