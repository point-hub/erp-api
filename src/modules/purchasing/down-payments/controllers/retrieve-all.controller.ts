import type { IController, IControllerInput } from '@point-hub/papi'

import { IAuth } from '@/modules/master/users/interface'
import { verifyUserToken } from '@/modules/master/users/utils/verify-user-token'

import { RetrieveAllDownPaymentRepository } from '../repositories/retrieve-all.repository'
import { RetrieveAllDownPaymentUseCase } from '../use-cases/retrieve-all.use-case'

export const retrieveAllDownPaymentController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const retrieveAllDownPaymentRepository = new RetrieveAllDownPaymentRepository(controllerInput.dbConnection, {
      session,
    })
    // 3. handle business rules
    // 3.1 check authenticated user
    const verifyTokenResponse = await verifyUserToken(controllerInput, { session })
    // 3.2 retrieve all
    const response = await RetrieveAllDownPaymentUseCase.handle(
      { query: controllerInput.httpRequest.query, auth: verifyTokenResponse as IAuth },
      { retrieveAllDownPaymentRepository },
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
