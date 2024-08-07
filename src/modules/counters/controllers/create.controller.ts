import { objClean } from '@point-hub/express-utils'
import type { IController, IControllerInput } from '@point-hub/papi'

import { schemaValidation } from '@/utils/validation'

import { CreateCounterRepository } from '../repositories/create.repository'
import { CreateCounterUseCase } from '../use-cases/create.use-case'

export const createCounterController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const createCounterRepository = new CreateCounterRepository(controllerInput.dbConnection)
    // 3. handle business rules
    const response = await CreateCounterUseCase.handle(
      controllerInput.httpRequest.body,
      {
        cleanObject: objClean,
        createCounterRepository,
        schemaValidation,
      },
      { session },
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
