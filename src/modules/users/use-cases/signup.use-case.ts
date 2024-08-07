import type { ISchemaValidation } from '@point-hub/papi'

import { UserEntity } from '../entity'
import type { ICreateUserRepository } from '../repositories/create.repository'
import type { IRetrieveUserRepository } from '../repositories/retrieve.repository'
import { signupValidation } from '../validations/signup.validation'

export interface IOutput {
  inserted_id: string
  user_info: {
    name: string
    username: string
    email: string
  }
}
export interface IInput {
  pointhubSecret: string
  data: {
    name: string
    username: string
    email: string
    password: string
  }
}
export interface IDeps {
  signupRepository: ICreateUserRepository
  retrieveUserRepository: IRetrieveUserRepository
  cleanObject(object: object): object
  schemaValidation: ISchemaValidation
  hashPassword(password: string): Promise<string>
  generateVerificationCode(): string
}
export interface IOptions {
  session?: unknown
}

export class SignupUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, signupValidation)
    // 2. define entity
    const codeVerification = deps.generateVerificationCode()
    const userEntity = new UserEntity({
      name: input.data.name,
      username: input.data.username,
      email: input.data.email,
      password: input.data.password ? await deps.hashPassword(input.data.password) : '',
      email_verification_code: codeVerification,
      is_email_verified: true,
    })
    userEntity.generateCreatedDate()
    const cleanEntity = deps.cleanObject(userEntity.data)
    // 3. database operation
    const responseSignup = await deps.signupRepository.handle(cleanEntity, options)
    // 4. get user recorded data
    const responseUser = await deps.retrieveUserRepository.handle(responseSignup.inserted_id, options)
    // 5. return response
    return {
      inserted_id: responseSignup.inserted_id,
      user_info: {
        name: responseUser.name,
        username: responseUser.username,
        email: responseUser.email,
      },
    }
  }
}
