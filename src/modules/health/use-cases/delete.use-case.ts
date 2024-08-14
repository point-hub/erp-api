import type { ISchemaValidation } from '@point-hub/papi'

import { IDeleteHealthRepository } from '../repositories/delete.repository'
import { deleteValidation } from '../validations/delete.validation'

export interface IInput {
  _id: string
}
export interface IDeps {
  schemaValidation: ISchemaValidation
  deleteHealthRepository: IDeleteHealthRepository
}
export interface IOptions {
  session?: unknown
}

export interface IOutput {
  deleted_count: number
}

export class DeleteHealthUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, deleteValidation)
    // 2. database operation
    const response = await deps.deleteHealthRepository.handle(input._id, options)
    // 3. output
    return { deleted_count: response.deleted_count }
  }
}
