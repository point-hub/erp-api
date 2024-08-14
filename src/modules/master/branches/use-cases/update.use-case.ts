import type { ISchemaValidation } from '@point-hub/papi'

import { IAuth } from '@/modules/master/users/interface'

import { BranchEntity } from '../entity'
import { IUpdateBranchRepository } from '../repositories/update.repository'
import { updateValidation } from '../validations/update.validation'

export interface IInput {
  auth: IAuth
  _id: string
  data: {
    code?: string
    name?: string
    address?: string
    phone?: string
    notes?: string
    updated_by?: string
  }
}
export interface IDeps {
  schemaValidation: ISchemaValidation
  updateBranchRepository: IUpdateBranchRepository
}
export interface IOptions {
  session?: unknown
}
export interface IOutput {
  matched_count: number
  modified_count: number
}

export class UpdateBranchUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, updateValidation)
    // 2. define entity
    const branchEntity = new BranchEntity({
      code: input.data.code,
      name: input.data.name,
      address: input.data.address,
      phone: input.data.phone,
      notes: input.data.notes,
      updated_by: input.auth._id,
    })
    branchEntity.generateUpdatedDate()
    // 3. database operation
    const response = await deps.updateBranchRepository.handle(input._id, branchEntity.data, options)
    // 4. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
