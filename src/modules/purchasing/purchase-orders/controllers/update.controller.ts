import { objClean, tokenGenerate } from '@point-hub/express-utils'
import type { IController, IControllerInput } from '@point-hub/papi'

import { IAuth } from '@/modules/master/users/interface'
import { verifyUserToken } from '@/modules/master/users/utils/verify-user-token'
import { schemaValidation } from '@/utils/validation'

import { UpdatePurchaseRequestReference } from '../../purchase-requests/utils/update-reference'
import { CreatePurchaseOrderRepository } from '../repositories/create.repository'
import { UpdatePurchaseOrderRepository } from '../repositories/update.repository'
import { UpdatePurchaseOrderUseCase } from '../use-cases/update.use-case'

export const updatePurchaseOrderController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const updatePurchaseOrderRepository = new UpdatePurchaseOrderRepository(controllerInput.dbConnection, {
      session,
    })
    const createPurchaseOrderRepository = new CreatePurchaseOrderRepository(controllerInput.dbConnection, {
      session,
    })
    const updatePurchaseRequestReference = new UpdatePurchaseRequestReference(controllerInput.dbConnection, { session })
    // 3. handle business rules
    // 3.1 check authenticated user
    const verifyTokenResponse = await verifyUserToken(controllerInput, { session })
    // 3.2 update
    const response = await UpdatePurchaseOrderUseCase.handle(
      {
        auth: verifyTokenResponse as IAuth,
        _id: controllerInput.httpRequest.params.id,
        data: controllerInput.httpRequest.body,
      },
      {
        objClean,
        schemaValidation,
        createPurchaseOrderRepository,
        updatePurchaseOrderRepository,
        updatePurchaseRequestReference,
        tokenGenerate,
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
