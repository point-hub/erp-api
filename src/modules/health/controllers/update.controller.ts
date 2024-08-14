import { objClean } from '@point-hub/express-utils'
import type { IController, IControllerInput } from '@point-hub/papi'

import { schemaValidation } from '@/utils/validation'

import { UpdateHealthRepository } from '../repositories/update.repository'
import { UpdateHealthUseCase } from '../use-cases/update.use-case'

export const updateHealthController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const updateHealthRepository = new UpdateHealthRepository(controllerInput.dbConnection)
    // 3. handle business rules
    const response = await UpdateHealthUseCase.handle(
      {
        _id: controllerInput.httpRequest.params.id,
        data: controllerInput.httpRequest.body,
      },
      { cleanObject: objClean, schemaValidation, updateHealthRepository },
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
