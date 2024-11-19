import type { IController, IControllerInput } from '@point-hub/papi'

import { verifyUserToken } from '@/modules/master/users/utils/verify-user-token'

import { RetrieveAllBranchRepository } from '../repositories/retrieve-all.repository'
import { RetrieveAllBranchUseCase } from '../use-cases/retrieve-all.use-case'

export const retrieveAllBranchController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const retrieveAllBranchRepository = new RetrieveAllBranchRepository(controllerInput.dbConnection, { session })
    // 3. handle business rules
    // 3.1 check authenticated user
    await verifyUserToken(controllerInput, { session })
    // 3.2 retrieve all
    const response = await RetrieveAllBranchUseCase.handle(
      { query: controllerInput.httpRequest.query },
      { retrieveAllBranchRepository },
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
