import { objClean } from '@point-hub/express-utils'
import type { IController, IControllerInput } from '@point-hub/papi'

import { RetrieveAllCounterRepository } from '@/modules/counters/repositories/retrieve-all.repository'
import { UpdateCounterRepository } from '@/modules/counters/repositories/update.repository'
import { schemaValidation } from '@/utils/validation'

import { CreateBranchRepository } from '../repositories/create.repository'
import { CreateBranchUseCase } from '../use-cases/create.use-case'

export const createBranchController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const createBranchRepository = new CreateBranchRepository(controllerInput.dbConnection)
    const updateRepository = new UpdateCounterRepository(controllerInput.dbConnection)
    const retrieveAllRepository = new RetrieveAllCounterRepository(controllerInput.dbConnection)
    // 3. handle business rules
    const response = await CreateBranchUseCase.handle(
      controllerInput.httpRequest.body,
      {
        cleanObject: objClean,
        createBranchRepository,
        updateRepository,
        retrieveAllRepository,
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
