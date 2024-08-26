import type { ISchemaValidation } from '@point-hub/papi'

import { IAuth } from '@/modules/master/users/interface'

import { SupplierGroupEntity } from '../entity'
import { IUpdateSupplierGroupRepository } from '../repositories/update.repository'
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
  updateSupplierGroupRepository: IUpdateSupplierGroupRepository
}
export interface IOptions {
  session?: unknown
}
export interface IOutput {
  matched_count: number
  modified_count: number
}

export class UpdateSupplierGroupUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input.data, updateValidation)
    // 2. define entity
    const supplierGroupEntity = new SupplierGroupEntity({
      code: input.data.code,
      name: input.data.name,
      notes: input.data.notes ?? '',
      updated_by: input.auth._id,
    })
    supplierGroupEntity.generateUpdatedDate()
    // 3. database operation
    const response = await deps.updateSupplierGroupRepository.handle(input._id, supplierGroupEntity.data, options)
    // 4. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
