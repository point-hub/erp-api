import type { ISchemaValidation, TypeCodeStatus } from '@point-hub/papi'

import type { IOptions as IOptionsApiError } from '@/utils/throw-api-error'

import { UserEntity } from '../entity'
import { IRetrieveMatchedUsernameRepository } from '../repositories/retrieve-matched-username.repository'
import { signinValidation } from '../validations/signin.validation'

export interface IInput {
  username: string
  password: string
}

export interface IDeps {
  retrieveMatchedUsernameRepository: IRetrieveMatchedUsernameRepository
  cleanObject(object: object): object
  schemaValidation: ISchemaValidation
  verifyPassword(password: string, hash: string): Promise<boolean>
  throwApiError(codeStatus: TypeCodeStatus, options?: IOptionsApiError): void
}

export class VerifyPasswordUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<boolean> {
    // 1. validate schema
    await deps.schemaValidation({ username: input.username, password: input.password }, signinValidation)
    // 2. check any matched username / email in database
    const userInput = new UserEntity({ username: input.username })
    const users = await deps.retrieveMatchedUsernameRepository.handle({
      filter: { username: userInput.data.trimmed_username },
    })
    // err.1. return error username is invalid
    if (users.data.length === 0) {
      deps.throwApiError(422, {
        errors: {
          username: ['username is invalid'],
        },
      })
    }
    // 3. validate password
    const user = new UserEntity({
      ...users.data[0],
    })
    const isPasswordVerified = await deps.verifyPassword(input.password, user.data.password as string)
    // err.2. return error password is invalid
    if (!isPasswordVerified) {
      return false
    }
    // 4. return data
    return true
  }
}
