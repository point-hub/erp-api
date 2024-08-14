import type { ISchemaValidation } from '@point-hub/papi'

import { IAuth } from '@/modules/master/users/interface'

import { ProcessEntity } from '../entity'
import { IUpdateProcessRepository } from '../repositories/update.repository'
import { updateValidation } from '../validations/update.validation'

export interface IInput {
  auth: IAuth
  _id: string
  data: {
    code?: string
    name?: string
    notes?: string
  }
}
export interface IDeps {
  schemaValidation: ISchemaValidation
  updateProcessRepository: IUpdateProcessRepository
}
export interface IOptions {
  session?: unknown
}
export interface IOutput {
  matched_count: number
  modified_count: number
}

export class UpdateProcessUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, updateValidation)
    // 2. define entity
    const processEntity = new ProcessEntity({
      code: input.data.code ?? '',
      name: input.data.name ?? '',
      notes: input.data.notes ?? '',
      updated_by: input.auth._id,
    })
    processEntity.generateUpdatedDate()
    // 3. database operation
    const response = await deps.updateProcessRepository.handle(input._id, processEntity.data, options)
    // 4. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
