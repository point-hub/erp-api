import type { ISchemaValidation, TypeCodeStatus } from '@point-hub/papi'

import type { IOptions as IOptionsApiError } from '@/utils/throw-api-error'

import { IRetrieveAllUserRepository } from '../../users/repositories/retrieve-all.repository'
import { IDeleteRoleRepository } from '../repositories/delete.repository'
import { IRetrieveRoleRepository } from '../repositories/retrieve.repository'
import { deleteValidation } from '../validations/delete.validation'

export interface IInput {
  _id: string
  reason: string
}

export interface IDeps {
  schemaValidation: ISchemaValidation
  retrieveAllUserRepository: IRetrieveAllUserRepository
  retrieveRoleRepository: IRetrieveRoleRepository
  deleteRoleRepository: IDeleteRoleRepository
  throwApiError(codeStatus: TypeCodeStatus, options?: IOptionsApiError): void
}

export interface IOutput {
  deleted_count: number
}

export class DeleteRoleUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, deleteValidation)
    // 2. check if doesn't have any relationship
    const role = await deps.retrieveRoleRepository.handle(input._id, options)
    const items = await deps.retrieveAllUserRepository.handle({ filter: { role_id: role._id } }, options)
    if (items.pagination.total_document) {
      deps.throwApiError(422, {
        errors: {
          reason: ['Delete failed, Role cannot be deleted because they are used as a reference in the master user'],
        },
      })
    }
    // 3. database operation
    const response = await deps.deleteRoleRepository.handle(input._id, options)
    // 4. output
    return { deleted_count: response.deleted_count }
  }
}
