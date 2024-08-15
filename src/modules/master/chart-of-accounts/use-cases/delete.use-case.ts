import type { ISchemaValidation } from '@point-hub/papi'

import { IDeleteChartOfAccountRepository } from '../repositories/delete.repository'
import { deleteValidation } from '../validations/delete.validation'

export interface IInput {
  _id: string
  reason: string
}
export interface IDeps {
  schemaValidation: ISchemaValidation
  deleteChartOfAccountRepository: IDeleteChartOfAccountRepository
}
export interface IOptions {
  session?: unknown
}
export interface IOutput {
  deleted_count: number
}

export class DeleteChartOfAccountUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, deleteValidation)
    // 2. database operation
    const response = await deps.deleteChartOfAccountRepository.handle(input._id, options)
    // 3. output
    return { deleted_count: response.deleted_count }
  }
}
