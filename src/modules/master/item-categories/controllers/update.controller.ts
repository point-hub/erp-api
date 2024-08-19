import type { IController, IControllerInput } from '@point-hub/papi'

import authConfig from '@/config/auth'
import { IAuth } from '@/modules/master/users/interface'
import { RetrieveAuthUserRepository } from '@/modules/master/users/repositories/retrieve-auth-user.repository'
import { VerifyTokenUseCase } from '@/modules/master/users/use-cases/verify-token.use-case'
import { verifyToken } from '@/modules/master/users/utils/jwt'
import { throwApiError } from '@/utils/throw-api-error'
import { schemaValidation } from '@/utils/validation'

import { UpdateItemCategoryRepository } from '../repositories/update.repository'
import { UpdateItemCategoryUseCase } from '../use-cases/update.use-case'

export const updateItemCategoryController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const retrieveAuthUserRepository = new RetrieveAuthUserRepository(controllerInput.dbConnection)
    const updateItemCategoryRepository = new UpdateItemCategoryRepository(controllerInput.dbConnection)
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
    // 3.2 update
    const response = await UpdateItemCategoryUseCase.handle(
      {
        auth: verifyTokenResponse as IAuth,
        _id: controllerInput.httpRequest.params.id,
        data: controllerInput.httpRequest.body,
      },
      { schemaValidation, updateItemCategoryRepository },
    )
    await session.commitTransaction()
    // 4. return response to client
    return {
      status: 200,
      json: {
        matched_count: response.matched_count,
        modified_count: response.modified_count,
      },
    }
  } catch (error) {
    await session?.abortTransaction()
    throw error
  } finally {
    await session?.endSession()
  }
}
