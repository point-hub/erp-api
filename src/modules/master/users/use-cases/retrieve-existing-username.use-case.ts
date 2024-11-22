import { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import { UserEntity } from '../entity'
import { IRetrieveAllUserRepository } from '../repositories/retrieve-all.repository'
import { retrieveExistingUsernameValidation } from '../validations/retrieve-existing-username.validation'

export interface IInput {
  username: string
}

export interface IDeps {
  retrieveExistingUsernameRepository: IRetrieveAllUserRepository
  objClean: IObjClean
  schemaValidation: ISchemaValidation
}

export class RetrieveExistingUsernameUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<boolean> {
    // 1. define entity
    const userEntity = new UserEntity({
      username: input.username,
    })
    userEntity.data = deps.objClean(userEntity.data)
    // 2. validate schema
    await deps.schemaValidation(userEntity.data, retrieveExistingUsernameValidation)
    // 3. database operation
    const response = await deps.retrieveExistingUsernameRepository.handle({
      filter: { trimmed_username: userEntity.data.trimmed_username },
    })
    // 4. return is username exists or not
    return response.pagination.total_document > 0
  }
}
