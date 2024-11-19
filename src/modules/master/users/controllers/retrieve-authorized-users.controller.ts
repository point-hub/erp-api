import type { IController, IControllerInput } from '@point-hub/papi'

import { RetrieveAuthorizedUsersRepository } from '../repositories/retrieve-authorized-users.repository'
import { RetrieveAuthorizedUsersUseCase } from '../use-cases/retrieve-authorized-users.use-case'
import { verifyUserToken } from '../utils/verify-user-token'

export const retrieveAuthorizedUsersController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const retrieveAuthorizedUsersRepository = new RetrieveAuthorizedUsersRepository(controllerInput.dbConnection, {
      session,
    })
    // 3. handle business rules
    // 3.1 check authenticated user
    await verifyUserToken(controllerInput, { session })
    // 3.2 retrieve all user
    const response = await RetrieveAuthorizedUsersUseCase.handle(
      { query: controllerInput.httpRequest.query },
      { retrieveAuthorizedUsersRepository },
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
