import type { ISchemaValidation, IUpdateOutput } from '@point-hub/papi'

import { PermissionEntity } from '../entity'
import { IUpdatePermissionRepository } from '../repositories/update.repository'
import { updateValidation } from '../validations/update.validation'

export interface IInput {
  _id: string
  data: {
    code?: string
    name?: string
    address?: string
    phone?: string
  }
}
export interface IDeps {
  cleanObject(object: object): object
  schemaValidation: ISchemaValidation
  updatePermissionRepository: IUpdatePermissionRepository
}
export interface IOptions {
  session?: unknown
}

export class UpdatePermissionUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IUpdateOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, updateValidation)
    // 2. define entity
    const permissionEntity = new PermissionEntity({
      code: input.data.code,
      name: input.data.name,
      address: input.data.address,
      phone: input.data.phone,
    })
    permissionEntity.generateUpdatedDate()
    // 3. database operation
    const response = await deps.updatePermissionRepository.handle(input._id, permissionEntity.data, options)
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
