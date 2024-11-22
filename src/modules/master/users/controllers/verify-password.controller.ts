import { objClean } from '@point-hub/express-utils'
import { type IController, type IControllerInput } from '@point-hub/papi'

import { throwApiError } from '@/utils/throw-api-error'
import { schemaValidation } from '@/utils/validation'

import { RetrieveMatchedUsernameRepository } from '../repositories/retrieve-matched-username.repository'
import { VerifyPasswordUseCase } from '../use-cases/verify-password.use-case'
import { verifyUserToken } from '../utils/verify-user-token'

export const verifyPasswordController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const retrieveMatchedUsernameRepository = new RetrieveMatchedUsernameRepository(controllerInput.dbConnection, {
      session,
    })
    // 3. handle business rules
    const verifyTokenResponse = await verifyUserToken(controllerInput, { session })
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
