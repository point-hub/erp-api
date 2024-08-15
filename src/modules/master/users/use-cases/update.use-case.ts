import type { ISchemaValidation, IUpdateOutput } from '@point-hub/papi'

import { UserEntity } from '../entity'
import { IUpdateUserRepository } from '../repositories/update.repository'
import { updateValidation } from '../validations/update.validation'

export interface IInput {
  _id: string
  data: {
    role_id?: string
    code?: string
    name?: string
    username?: string
    email?: string
  }
}
export interface IDeps {
  cleanObject(object: object): object
  schemaValidation: ISchemaValidation
  updateUserRepository: IUpdateUserRepository
}
export interface IOptions {
  session?: unknown
}

export class UpdateUserUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IUpdateOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, updateValidation)
    // 2. define entity
    const userEntity = new UserEntity({
      role_id: input.data.role_id,
      code: input.data.code,
      name: input.data.name,
      username: input.data.username,
      email: input.data.email,
    })
    userEntity.generateUpdatedDate()
    // 3. database operation
    const response = await deps.updateUserRepository.handle(input._id, userEntity.data, options)
    // 4. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
