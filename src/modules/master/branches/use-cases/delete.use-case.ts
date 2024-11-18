import type { ISchemaValidation, TypeCodeStatus } from '@point-hub/papi'

import type { IOptions as IOptionsApiError } from '@/utils/throw-api-error'

import { IRetrieveAllWarehouseRepository } from '../../warehouses/repositories/retrieve-all.repository'
import { IDeleteBranchRepository } from '../repositories/delete.repository'
import { deleteValidation } from '../validations/delete.validation'

export interface IInput {
  _id: string
  reason: string
}

export interface IDeps {
  schemaValidation: ISchemaValidation
  retrieveAllWarehouseRepository: IRetrieveAllWarehouseRepository
  deleteBranchRepository: IDeleteBranchRepository
  throwApiError(codeStatus: TypeCodeStatus, options?: IOptionsApiError): void
}

export interface IOutput {
  deleted_count: number
}

export class DeleteBranchUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, deleteValidation)
    // 2. check if doesn't have any relationship
    const warehouses = await deps.retrieveAllWarehouseRepository.handle({ filter: { branch_id: input._id } }, options)
    if (warehouses.pagination.total_document) {
      deps.throwApiError(422, {
        errors: {
          reason: [
            'Delete failed, Branch cannot be deleted because they are used as a reference in the master warehouse',
          ],
        },
      })
    }
    // 3. database operation
    const response = await deps.deleteBranchRepository.handle(input._id, options)
    // 4. output
    return { deleted_count: response.deleted_count }
  }
}
