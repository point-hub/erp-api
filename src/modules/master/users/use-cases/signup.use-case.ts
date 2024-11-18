import { IObjClean } from '@point-hub/express-utils'
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
  name: string
  username: string
  email: string
  password: string
  default_branch: string
  branches: string[]
  default_warehouse: string
  warehouses: string[]
}

export interface IDeps {
  signupRepository: ICreateUserRepository
  retrieveUserRepository: IRetrieveUserRepository
  retrieveAllCounterRepository: IRetrieveAllCounterRepository
  updateCounterRepository: IUpdateCounterRepository
  objClean: IObjClean
  schemaValidation: ISchemaValidation
  hashPassword(password: string): Promise<string>
  generateVerificationCode(): string
}

export class SignupUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, signupValidation)
    // 2. define entity
    const codeVerification = deps.generateVerificationCode()
    const userEntity = new UserEntity({
      role_id: input.role_id,
      name: input.name,
      username: input.username,
      email: input.email,
      password: input.password ? await deps.hashPassword(input.password) : '',
      email_verification_code: codeVerification,
      is_email_verified: true,
      default_branch: input.default_branch,
      default_warehouse: input.default_warehouse,
      branches: input.branches,
      warehouses: input.warehouses,
    })
    userEntity.generateCreatedDate()
    userEntity.data = deps.objClean(userEntity.data)
    // 3. database operation
    const responseSignup = await deps.signupRepository.handle(userEntity.data)
    // 4. get user recorded data
    const responseUser = await deps.retrieveUserRepository.handle({ _id: responseSignup.inserted_id })
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
