import type { IController, IControllerInput } from '@point-hub/papi'

import { IAuth } from '@/modules/master/users/interface'
import { verifyUserToken } from '@/modules/master/users/utils/verify-user-token'
import { schemaValidation } from '@/utils/validation'

import { UpdatePurchaseRequestReference } from '../../purchase-requests/utils/update-reference'
import { DeletePurchaseOrderRepository } from '../repositories/delete.repository'
import { RetrievePurchaseOrderRepository } from '../repositories/retrieve.repository'
import { DeletePurchaseOrderUseCase } from '../use-cases/delete.use-case'

export const deletePurchaseOrderController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const retrievePurchaseOrderRepository = new RetrievePurchaseOrderRepository(controllerInput.dbConnection, {
      session,
    })
    const deletePurchaseOrderRepository = new DeletePurchaseOrderRepository(controllerInput.dbConnection, {
      session,
    })
    const updatePurchaseRequestReference = new UpdatePurchaseRequestReference(controllerInput.dbConnection, { session })
    // 3. handle business logic
    // 3.1 check authenticated user
    const verifyTokenResponse = await verifyUserToken(controllerInput, { session })
    // 3.2 delete
    const response = await DeletePurchaseOrderUseCase.handle(
      {
        _id: controllerInput.httpRequest.params.id,
        auth: verifyTokenResponse as IAuth,
        reason: controllerInput.httpRequest.body.reason,
      },
      {
        schemaValidation,
        retrievePurchaseOrderRepository,
        deletePurchaseOrderRepository,
        updatePurchaseRequestReference,
      },
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
