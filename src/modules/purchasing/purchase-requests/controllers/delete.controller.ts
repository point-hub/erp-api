import type { IController, IControllerInput } from '@point-hub/papi'

import { IAuth } from '@/modules/master/users/interface'
import { verifyUserToken } from '@/modules/master/users/utils/verify-user-token'
import { schemaValidation } from '@/utils/validation'

import { DeletePurchaseRequestRepository } from '../repositories/delete.repository'
import { DeletePurchaseRequestUseCase } from '../use-cases/delete.use-case'

export const deletePurchaseRequestController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const deletePurchaseRequestRepository = new DeletePurchaseRequestRepository(controllerInput.dbConnection, {
      session,
    })
    // 3. handle business logic
    // 3.1 check authenticated user
    const verifyTokenResponse = await verifyUserToken(controllerInput, { session })
    // 3.2 delete
    const response = await DeletePurchaseRequestUseCase.handle(
      {
        _id: controllerInput.httpRequest.params.id,
        auth: verifyTokenResponse as IAuth,
        reason: controllerInput.httpRequest.body.reason,
      },
      { schemaValidation, deletePurchaseRequestRepository },
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
