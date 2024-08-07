import type { IDeleteOutput, IDeleteRepository, ISchemaValidation } from '@point-hub/papi'

import { deleteValidation } from '../validations/delete.validation'

export interface IInput {
  _id: string
}
export interface IDeps {
  schemaValidation: ISchemaValidation
  deleteRepository: IDeleteRepository
}
export interface IOptions {
  session?: unknown
}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IOutput extends IDeleteOutput {}

export class DeleteAllocationGroupUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, deleteValidation)
    // 2. database operation
    const response = await deps.deleteRepository.handle(input._id, options)
    return { deleted_count: response.deleted_count }
  }
}
