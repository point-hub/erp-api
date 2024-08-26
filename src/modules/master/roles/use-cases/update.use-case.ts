import type { ISchemaValidation } from '@point-hub/papi'

import { IAuth } from '@/modules/master/users/interface'

import { RoleEntity } from '../entity'
import { IUpdateRoleRepository } from '../repositories/update.repository'
import { updateValidation } from '../validations/update.validation'

export interface IInput {
  auth: IAuth
  _id: string
  data: {
    code?: string
    name?: string
    permission?: { [key: string]: boolean | { [key: string]: boolean } }
    notes?: string
    updated_by?: string
  }
}
export interface IDeps {
  schemaValidation: ISchemaValidation
  updateRoleRepository: IUpdateRoleRepository
}
export interface IOptions {
  session?: unknown
}
export interface IOutput {
  matched_count: number
  modified_count: number
}

export class UpdateRoleUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input.data, updateValidation)
    // 2. define entity
    const roleEntity = new RoleEntity({
      code: input.data.code,
      name: input.data.name,
      permission: input.data.permission,
      notes: input.data.notes ?? '',
      updated_by: input.auth._id,
    })
    roleEntity.generateUpdatedDate()
    // 3. database operation
    const response = await deps.updateRoleRepository.handle(input._id, roleEntity.data, options)
    // 4. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
