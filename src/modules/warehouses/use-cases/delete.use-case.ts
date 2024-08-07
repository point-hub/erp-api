import type { IDeleteOutput, ISchemaValidation } from '@point-hub/papi'

import { IDeleteWarehouseRepository } from '../repositories/delete.repository'
import { deleteValidation } from '../validations/delete.validation'

export interface IInput {
  _id: string
  reason: string
}
export interface IDeps {
  schemaValidation: ISchemaValidation
  deleteWarehouseRepository: IDeleteWarehouseRepository
}
export interface IOptions {
  session?: unknown
}

export class DeleteWarehouseUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IDeleteOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, deleteValidation)
    // 2. database operation
    const response = await deps.deleteWarehouseRepository.handle(input._id, options)
    // 3. output
    return { deleted_count: response.deleted_count }
  }
}
