import type { ISchemaValidation } from '@point-hub/papi'

import { IRetrieveAllCounterRepository } from '@/modules/counters/repositories/retrieve-all.repository'
import { IUpdateCounterRepository } from '@/modules/counters/repositories/update.repository'

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
  role_id: string
  code: string
  name: string
  username: string
  email: string
  password: string
}
export interface IDeps {
  signupRepository: ICreateUserRepository
  retrieveUserRepository: IRetrieveUserRepository
  retrieveAllCounterRepository: IRetrieveAllCounterRepository
  updateCounterRepository: IUpdateCounterRepository
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
      role_id: input.role_id,
      code: input.code,
      name: input.name,
      username: input.username,
      email: input.email,
      password: input.password ? await deps.hashPassword(input.password) : '',
      email_verification_code: codeVerification,
      is_email_verified: true,
    })
    userEntity.generateCreatedDate()
    const cleanEntity = deps.cleanObject(userEntity.data)
    // 3. database operation
    // 3.1. signup new user
    const responseSignup = await deps.signupRepository.handle(cleanEntity, options)
    // 3.2. update code counter
    const counters = await deps.retrieveAllCounterRepository.handle({ filter: { name: 'user-code' } }, options)
    await deps.updateCounterRepository.handle(
      counters.data[0]._id,
      { count: Number(counters.data[0].count) + 1 },
      options,
    )
    // 4. get user recorded data
    const responseUser = await deps.retrieveUserRepository.handle({ _id: responseSignup.inserted_id }, options)
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
