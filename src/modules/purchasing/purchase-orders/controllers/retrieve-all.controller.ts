import type { IController, IControllerInput } from '@point-hub/papi'

import authConfig from '@/config/auth'
import { IAuth } from '@/modules/master/users/interface'
import { RetrieveAuthUserRepository } from '@/modules/master/users/repositories/retrieve-auth-user.repository'
import { VerifyTokenUseCase } from '@/modules/master/users/use-cases/verify-token.use-case'
import { verifyToken } from '@/modules/master/users/utils/jwt'
import { throwApiError } from '@/utils/throw-api-error'
import { schemaValidation } from '@/utils/validation'

import { RetrieveAllPurchaseOrderRepository } from '../repositories/retrieve-all.repository'
import { RetrieveAllPurchaseOrderUseCase } from '../use-cases/retrieve-all.use-case'

export const retrieveAllPurchaseOrderController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const retrieveAuthUserRepository = new RetrieveAuthUserRepository(controllerInput.dbConnection)
    const retrieveAllPurchaseOrderRepository = new RetrieveAllPurchaseOrderRepository(controllerInput.dbConnection)
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
    // 3.2 retrieve all
    const response = await RetrieveAllPurchaseOrderUseCase.handle(
      { query: controllerInput.httpRequest.query, auth: verifyTokenResponse as IAuth },
      { retrieveAllPurchaseOrderRepository },
    )
    await session.commitTransaction()
    // 4. return response to client
    return {
      status: 200,
      json: {
        data: response.data,
        pagination: response.pagination,
      },
    }
  } catch (error) {
    await session?.abortTransaction()
    throw error
  } finally {
    await session?.endSession()
  }
}
