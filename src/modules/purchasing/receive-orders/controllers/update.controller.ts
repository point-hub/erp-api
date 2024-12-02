import { objClean } from '@point-hub/express-utils'
import type { IController, IControllerInput } from '@point-hub/papi'

import { IAuth } from '@/modules/master/users/interface'
import { verifyUserToken } from '@/modules/master/users/utils/verify-user-token'
import { schemaValidation } from '@/utils/validation'

import { UpdatePurchaseOrderReference } from '../../purchase-orders/utils/update-reference'
import { CreateReceiveOrderRepository } from '../repositories/create.repository'
import { UpdateReceiveOrderRepository } from '../repositories/update.repository'
import { UpdateReceiveOrderUseCase } from '../use-cases/update.use-case'

export const updateReceiveOrderController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const updateReceiveOrderRepository = new UpdateReceiveOrderRepository(controllerInput.dbConnection, {
      session,
    })
    const createReceiveOrderRepository = new CreateReceiveOrderRepository(controllerInput.dbConnection, {
      session,
    })
    const updatePurchaseOrderReference = new UpdatePurchaseOrderReference(controllerInput.dbConnection, { session })
    // 3. handle business rules
    // 3.1 check authenticated user
    const verifyTokenResponse = await verifyUserToken(controllerInput, { session })
    // 3.2 update
    const response = await UpdateReceiveOrderUseCase.handle(
      {
        auth: verifyTokenResponse as IAuth,
        _id: controllerInput.httpRequest.params.id,
        data: controllerInput.httpRequest.body,
      },
      {
        objClean,
        schemaValidation,
        createReceiveOrderRepository,
        updateReceiveOrderRepository,
        updatePurchaseOrderReference,
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
