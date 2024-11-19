import type { ISchemaValidation } from '@point-hub/papi'

import { IRetrieveAllAllocationRepository } from '@/modules/master/allocations/repositories/retrieve-all.repository'
import type { IThrowApiError } from '@/utils/throw-api-error'

import { IDeleteAllocationGroupRepository } from '../repositories/delete.repository'
import { deleteValidation } from '../validations/delete.validation'

export interface IInput {
  _id: string
  reason: string
}

export interface IDeps {
  schemaValidation: ISchemaValidation
  retrieveAllAllocationRepository: IRetrieveAllAllocationRepository
  deleteAllocationGroupRepository: IDeleteAllocationGroupRepository
  throwApiError: IThrowApiError
}

export interface IOutput {
  deleted_count: number
}

export class DeleteAllocationGroupUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, deleteValidation)
    // 2. check if doesn't have any relationship
    const allocations = await deps.retrieveAllAllocationRepository.handle({
      filter: { 'allocation_group._id': input._id },
    })
    if (allocations.pagination.total_document) {
      deps.throwApiError(422, {
        errors: {
          reason: [
            'Delete failed, Allocation Group cannot be deleted because they are used as a reference in the master allocation',
          ],
        },
      })
    }
    // 3. database operation
    const response = await deps.deleteAllocationGroupRepository.handle(input._id)
    // 4. output
    return { deleted_count: response.deleted_count }
  }
}
