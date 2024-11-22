import type { IController, IControllerInput } from '@point-hub/papi'

import { IAuth } from '@/modules/master/users/interface'
import { verifyUserToken } from '@/modules/master/users/utils/verify-user-token'

import { RetrieveAllPurchaseOrderRepository } from '../repositories/retrieve-all.repository'
import { RetrieveAllPurchaseOrderUseCase } from '../use-cases/retrieve-all.use-case'

export const retrieveAllPurchaseOrderController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const retrieveAllPurchaseOrderRepository = new RetrieveAllPurchaseOrderRepository(controllerInput.dbConnection, {
      session,
    })
    // 3. handle business rules
    // 3.1 check authenticated user
    const verifyTokenResponse = await verifyUserToken(controllerInput, { session })
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
