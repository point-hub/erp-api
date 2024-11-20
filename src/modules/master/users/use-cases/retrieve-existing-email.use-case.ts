import { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import { UserEntity } from '../entity'
import { IRetrieveAllUserRepository } from '../repositories/retrieve-all.repository'
import { retrieveExistingEmailValidation } from '../validations/retrieve-existing-email.validation'

export interface IInput {
  email: string
}

export interface IDeps {
  retrieveExistingEmailRepository: IRetrieveAllUserRepository
  objClean: IObjClean
  schemaValidation: ISchemaValidation
}

export class RetrieveExistingEmailUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<boolean> {
    // 1. define entity
    const userEntity = new UserEntity({
      email: input.email,
    })
    userEntity.data = deps.objClean(userEntity.data)
    // 2. validate schema
    await deps.schemaValidation(userEntity.data, retrieveExistingEmailValidation)
    // 3. database operation
    const response = await deps.retrieveExistingEmailRepository.handle({
      filter: { trimmed_email: userEntity.data.trimmed_email },
    })
    // 4. return is email exists or not
    return response.pagination.total_document > 0
  }
}
