import type { ISchemaValidation, TypeCodeStatus } from '@point-hub/papi'

import type { IOptions as IOptionsApiError } from '@/utils/throw-api-error'

import { IRetrieveAllItemRepository } from '../../items/repositories/retrieve-all.repository'
import { IDeleteItemCategoryRepository } from '../repositories/delete.repository'
import { IRetrieveItemCategoryRepository } from '../repositories/retrieve.repository'
import { deleteValidation } from '../validations/delete.validation'

export interface IInput {
  _id: string
  reason: string
}

export interface IDeps {
  schemaValidation: ISchemaValidation
  retrieveAllItemRepository: IRetrieveAllItemRepository
  retrieveItemCategoryRepository: IRetrieveItemCategoryRepository
  deleteItemCategoryRepository: IDeleteItemCategoryRepository
  throwApiError(codeStatus: TypeCodeStatus, options?: IOptionsApiError): void
}

export interface IOutput {
  deleted_count: number
}

export class DeleteItemCategoryUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, deleteValidation)
    // 2. check if doesn't have any relationship
    const itemCategory = await deps.retrieveItemCategoryRepository.handle(input._id, options)
    const items = await deps.retrieveAllItemRepository.handle({ filter: { category_id: itemCategory._id } }, options)
    if (items.pagination.total_document) {
      deps.throwApiError(422, {
        errors: {
          reason: [
            'Delete failed, Item category cannot be deleted because they are used as a reference in the master item',
          ],
        },
      })
    }
    // 3. database operation
    const response = await deps.deleteItemCategoryRepository.handle(input._id, options)
    // 4. output
    return { deleted_count: response.deleted_count }
  }
}
