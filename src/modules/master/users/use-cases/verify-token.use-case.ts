import type { ISchemaValidation, TypeCodeStatus } from '@point-hub/papi'
import { type JwtPayload } from 'jsonwebtoken'

import type { IOptions as IOptionsApiError } from '@/utils/throw-api-error'
import { throwApiError } from '@/utils/throw-api-error'

import { IRetrieveAuthUserRepository } from '../repositories/retrieve-auth-user.repository'
import { verifyTokenValidation } from '../validations/verify-token.validation'

export interface IInput {
  project_id: string
  token: string
  secret: string
}

export interface IDeps {
  retrieveAuthUserRepository: IRetrieveAuthUserRepository
  throwApiError(codeStatus: TypeCodeStatus, options: IOptionsApiError): void
  schemaValidation: ISchemaValidation
  verifyToken(token: string, secret: string): string | JwtPayload
}

export interface IOutput {
  _id: string
  email: string
  username: string
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  role: { [key: string]: any }
  default_branch: string
  branches: string[]
  default_warehouse: string
  warehouses: string[]
}

export class VerifyTokenUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, verifyTokenValidation)
    // 2. verify token
    const decodedToken = deps.verifyToken(input.token, input.secret)
    if (!decodedToken) {
      // err 2.1 unverified token
      throwApiError(403)
    }
    // 3. database operation
    const authUser = await deps.retrieveAuthUserRepository.handle({
      user_id: decodedToken.sub,
      project_id: input.project_id,
    })
    // 4. return response
    return {
      _id: authUser.data[0]._id as string,
      email: authUser.data[0].email as string,
      username: authUser.data[0].username as string,
      name: authUser.data[0].name as string,
      role: authUser.data[0].role as { [key: string]: boolean | { [key: string]: boolean } },
      default_branch: authUser.data[0].default_branch as string,
      branches: authUser.data[0].branches as string[],
      default_warehouse: authUser.data[0].default_warehouse as string,
      warehouses: authUser.data[0].warehouses as string[],
    }
  }
}
