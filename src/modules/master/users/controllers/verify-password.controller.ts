import { objClean } from '@point-hub/express-utils'
import { type IController, type IControllerInput } from '@point-hub/papi'

import authConfig from '@/config/auth'
import { throwApiError } from '@/utils/throw-api-error'
import { schemaValidation } from '@/utils/validation'

import { RetrieveAuthUserRepository } from '../repositories/retrieve-auth-user.repository'
import { RetrieveMatchedUsernameRepository } from '../repositories/retrieve-matched-username.repository'
import { VerifyPasswordUseCase } from '../use-cases/verify-password.use-case'
import { VerifyTokenUseCase } from '../use-cases/verify-token.use-case'
import { verifyToken } from '../utils/jwt'

export const verifyPasswordController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const retrieveAuthUserRepository = new RetrieveAuthUserRepository(controllerInput.dbConnection)
    const retrieveMatchedUsernameRepository = new RetrieveMatchedUsernameRepository(controllerInput.dbConnection)
    // 3. handle business rules
    const verifyTokenResponse = await VerifyTokenUseCase.handle(
      {
        token: controllerInput.httpRequest.signedCookies.POINTHUB_ACCESS,
        secret: authConfig.secret,
        project_id: controllerInput.httpRequest.query.project_id,
      },
      {
        schemaValidation,
        throwApiError,
        retrieveAuthUserRepository,
        verifyToken,
      },
      { session },
    )
    const response = await VerifyPasswordUseCase.handle(
      {
        username: verifyTokenResponse.username,
        password: controllerInput.httpRequest.body.password,
      },
      {
        retrieveMatchedUsernameRepository,
        objClean,
        schemaValidation,
        verifyPassword: Bun.password.verify,
        throwApiError,
      },
      { session },
    )
    await session.commitTransaction()
    // 4. return response to client
    return {
      status: 200,
      json: {
        verified: response,
      },
    }
  } catch (error) {
    await session?.abortTransaction()
    throw error
  } finally {
    await session?.endSession()
  }
}
