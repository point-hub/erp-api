import { objClean } from '@point-hub/express-utils'
import type { IController, IControllerInput } from '@point-hub/papi'

import { schemaValidation } from '@/utils/validation'

import { CreateManyRepository } from '../repositories/create-many.repository'
import { CreateManyChartOfAccountUseCase } from '../use-cases/create-many.use-case'

export const createManyChartOfAccountController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const createManyRepository = new CreateManyRepository(controllerInput.dbConnection)
    // 3. handle business rules
    const response = await CreateManyChartOfAccountUseCase.handle(
      controllerInput.httpRequest.body,
      { cleanObject: objClean, schemaValidation, createManyRepository },
      { session },
    )
    await session.commitTransaction()
    // 4. return response to client
    return {
      status: 201,
      json: {
        inserted_ids: response.inserted_ids,
        inserted_count: response.inserted_count,
      },
    }
  } catch (error) {
    await session?.abortTransaction()
    throw error
  } finally {
    await session?.endSession()
  }
}
