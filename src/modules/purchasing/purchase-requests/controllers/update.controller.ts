import { objClean, tokenGenerate } from '@point-hub/express-utils'
import type { IController, IControllerInput } from '@point-hub/papi'

import { IAuth } from '@/modules/master/users/interface'
import { verifyUserToken } from '@/modules/master/users/utils/verify-user-token'
import { schemaValidation } from '@/utils/validation'

import { CreatePurchaseRequestRepository } from '../repositories/create.repository'
import { UpdatePurchaseRequestRepository } from '../repositories/update.repository'
import { UpdatePurchaseRequestUseCase } from '../use-cases/update.use-case'

export const updatePurchaseRequestController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const updatePurchaseRequestRepository = new UpdatePurchaseRequestRepository(controllerInput.dbConnection, {
      session,
    })
    const createPurchaseRequestRepository = new CreatePurchaseRequestRepository(controllerInput.dbConnection, {
      session,
    })
    // 3. handle business rules
    // 3.1 check authenticated user
    const verifyTokenResponse = await verifyUserToken(controllerInput, { session })
    // 3.2 update
    const response = await UpdatePurchaseRequestUseCase.handle(
      {
        auth: verifyTokenResponse as IAuth,
        _id: controllerInput.httpRequest.params.id,
        data: controllerInput.httpRequest.body,
      },
      {
        objClean,
        schemaValidation,
        tokenGenerate,
        createPurchaseRequestRepository,
        updatePurchaseRequestRepository,
      },
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
