import type { ISchemaValidation, TypeCodeStatus } from '@point-hub/papi'

import type { IOptions as IOptionsApiError } from '@/utils/throw-api-error'

import { IRetrieveAllCustomerRepository } from '../../customers/repositories/retrieve-all.repository'
import { IDeleteCustomerGroupRepository } from '../repositories/delete.repository'
import { deleteValidation } from '../validations/delete.validation'

export interface IInput {
  _id: string
  reason: string
}

export interface IDeps {
  schemaValidation: ISchemaValidation
  retrieveAllCustomerRepository: IRetrieveAllCustomerRepository
  deleteCustomerGroupRepository: IDeleteCustomerGroupRepository
  throwApiError(codeStatus: TypeCodeStatus, options?: IOptionsApiError): void
}

export interface IOutput {
  deleted_count: number
}

export class DeleteCustomerGroupUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, deleteValidation)
    // 2. check if doesn't have any relationship
    const customers = await deps.retrieveAllCustomerRepository.handle({ filter: { customer_group_id: input._id } })
    if (customers.pagination.total_document) {
      deps.throwApiError(422, {
        errors: {
          reason: [
            'Delete failed, Customer Group cannot be deleted because they are used as a reference in the master customer',
          ],
        },
      })
    }
    // 3. database operation
    const response = await deps.deleteCustomerGroupRepository.handle(input._id)
    // 4. output
    return { deleted_count: response.deleted_count }
  }
}
