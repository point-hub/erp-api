import type { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation, IUpdateOutput } from '@point-hub/papi'

import { UserEntity } from '../entity'
import { IUpdateUserRepository } from '../repositories/update.repository'
import { updateValidation } from '../validations/update.validation'

export interface IInput {
  _id: string
  data: {
    role_id?: string
    name?: string
    username?: string
    email?: string
    default_branch: string
    default_warehouse: string
    branches: string[]
    warehouses: string[]
  }
}

export interface IDeps {
  objClean: IObjClean
  schemaValidation: ISchemaValidation
  updateUserRepository: IUpdateUserRepository
}

export class UpdateUserUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IUpdateOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, updateValidation)
    // 2. define entity
    const userEntity = new UserEntity({
      role_id: input.data.role_id,
      name: input.data.name,
      username: input.data.username,
      email: input.data.email,
      default_branch: input.data.default_branch ?? '',
      default_warehouse: input.data.default_warehouse ?? '',
      branches: input.data.branches ?? [],
      warehouses: input.data.warehouses ?? [],
    })
    userEntity.generateUpdatedDate()
    userEntity.data = deps.objClean(userEntity.data)
    // 3. database operation
    const response = await deps.updateUserRepository.handle(input._id, userEntity.data)
    // 4. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
