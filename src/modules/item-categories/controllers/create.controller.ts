import { objClean } from '@point-hub/express-utils'
import type { IController, IControllerInput } from '@point-hub/papi'

import authConfig from '@/config/auth'
import { RetrieveAuthUserRepository } from '@/modules/users/repositories/retrieve-auth-user.repository'
import { VerifyTokenUseCase } from '@/modules/users/use-cases/verify-token.use-case'
import { verifyToken } from '@/modules/users/utils/jwt'
import { throwApiError } from '@/utils/throw-api-error'
import { schemaValidation } from '@/utils/validation'

import { CreateItemCategoryRepository } from '../repositories/create.repository'
import { CreateItemCategoryUseCase } from '../use-cases/create.use-case'

export const createItemCategoryController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const retrieveAuthUserRepository = new RetrieveAuthUserRepository(controllerInput.dbConnection)
    const createItemCategoryRepository = new CreateItemCategoryRepository(controllerInput.dbConnection)
    // 3. handle business rules
    // 3.1 check authenticated user
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
    console.log(verifyTokenResponse)
    // 3.2 create item category
    const response = await CreateItemCategoryUseCase.handle(
      controllerInput.httpRequest.body,
      {
        cleanObject: objClean,
        createItemCategoryRepository,
        schemaValidation,
      },
      { session },
    )
    await session.commitTransaction()
    // 4. return response to client
    return {
      status: 201,
      json: {
        inserted_id: response.inserted_id,
      },
    }
  } catch (error) {
    await session?.abortTransaction()
    throw error
  } finally {
    await session?.endSession()
  }
}
