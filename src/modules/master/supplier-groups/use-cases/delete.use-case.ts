import type { ISchemaValidation, TypeCodeStatus } from '@point-hub/papi'

import type { IOptions as IOptionsApiError } from '@/utils/throw-api-error'

import { IRetrieveAllSupplierRepository } from '../../suppliers/repositories/retrieve-all.repository'
import { IDeleteSupplierGroupRepository } from '../repositories/delete.repository'
import { deleteValidation } from '../validations/delete.validation'

export interface IInput {
  _id: string
  reason: string
}
export interface IDeps {
  schemaValidation: ISchemaValidation
  retrieveAllSupplierRepository: IRetrieveAllSupplierRepository
  deleteSupplierGroupRepository: IDeleteSupplierGroupRepository
  throwApiError(codeStatus: TypeCodeStatus, options?: IOptionsApiError): void
}
export interface IOptions {
  session?: unknown
}
export interface IOutput {
  deleted_count: number
}

export class DeleteSupplierGroupUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, deleteValidation)
    // 2. check if doesn't have any relationship
    const suppliers = await deps.retrieveAllSupplierRepository.handle(
      { filter: { supplier_group_id: input._id } },
      options,
    )
    if (suppliers.pagination.total_document) {
      deps.throwApiError(422, {
        errors: {
          reason: [
            'Delete failed, Supplier Group cannot be deleted because they are used as a reference in the master supplier',
          ],
        },
      })
    }
    // 3. database operation
    const response = await deps.deleteSupplierGroupRepository.handle(input._id, options)
    // 4. output
    return { deleted_count: response.deleted_count }
  }
}
