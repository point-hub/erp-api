import type { IController, IControllerInput } from '@point-hub/papi'

import { RetrieveHealthRepository } from '../repositories/retrieve.repository'
import { RetrieveHealthUseCase } from '../use-cases/retrieve.use-case'

export const retrieveHealthController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const retrieveHealthRepository = new RetrieveHealthRepository(controllerInput.dbConnection)
    // 3. handle business rules
    const response = await RetrieveHealthUseCase.handle(
      { _id: controllerInput.httpRequest.params.id },
      { retrieveHealthRepository },
    )
    await session.commitTransaction()
    // 4. return response to client
    return {
      status: 200,
      json: {
        _id: response._id,
        code: response.code,
        name: response.name,
        created_date: response.created_date,
        updated_date: response.updated_date,
      },
    }
  } catch (error) {
    await session?.abortTransaction()
    throw error
  } finally {
    await session?.endSession()
  }
}
