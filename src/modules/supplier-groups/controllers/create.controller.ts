import { objClean, tokenGenerate, tokenSha256 } from '@point-hub/express-utils'
import type { IController, IControllerInput } from '@point-hub/papi'

import { RetrieveAllRepository } from '@/modules/counters/repositories/retrieve-all.repository'
import { UpdateRepository } from '@/modules/counters/repositories/update.repository'
import { schemaValidation } from '@/utils/validation'

import { CreateRepository } from '../repositories/create.repository'
import { CreateSupplierGroupUseCase } from '../use-cases/create.use-case'

export const createSupplierGroupController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const createRepository = new CreateRepository(controllerInput.dbConnection)
    const updateRepository = new UpdateRepository(controllerInput.dbConnection)
    const retrieveAllRepository = new RetrieveAllRepository(controllerInput.dbConnection)
    // 3. handle business rules
    const response = await CreateSupplierGroupUseCase.handle(
      controllerInput.httpRequest.body,
      {
        cleanObject: objClean,
        createRepository,
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
        api_key: response.api_key,
      },
    }
  } catch (error) {
    await session?.abortTransaction()
    throw error
  } finally {
    await session?.endSession()
  }
}
