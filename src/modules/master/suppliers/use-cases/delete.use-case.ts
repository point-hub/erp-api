import type { ISchemaValidation } from '@point-hub/papi'

import { IDeleteSupplierRepository } from '../repositories/delete.repository'
import { deleteValidation } from '../validations/delete.validation'

export interface IInput {
  _id: string
  reason: string
}

export interface IDeps {
  schemaValidation: ISchemaValidation
  deleteSupplierRepository: IDeleteSupplierRepository
}

export interface IOutput {
  deleted_count: number
}

export class DeleteSupplierUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, deleteValidation)
    // 2. database operation
    const response = await deps.deleteSupplierRepository.handle(input._id, options)
    // 3. output
    return { deleted_count: response.deleted_count }
  }
}
