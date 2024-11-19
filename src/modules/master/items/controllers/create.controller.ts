import { objClean } from '@point-hub/express-utils'
import type { IController, IControllerInput } from '@point-hub/papi'

import { RetrieveAllCounterRepository } from '@/modules/counters/repositories/retrieve-all.repository'
import { UpdateCounterRepository } from '@/modules/counters/repositories/update.repository'
import { RetrieveItemCategoryRepository } from '@/modules/master/item-categories/repositories/retrieve.repository'
import { IAuth } from '@/modules/master/users/interface'
import { verifyUserToken } from '@/modules/master/users/utils/verify-user-token'
import { schemaValidation } from '@/utils/validation'

import { CreateItemRepository } from '../repositories/create.repository'
import { CreateItemUseCase } from '../use-cases/create.use-case'

export const createItemController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const retrieveItemCategoryRepository = new RetrieveItemCategoryRepository(controllerInput.dbConnection, { session })
    const createItemRepository = new CreateItemRepository(controllerInput.dbConnection, { session })
    const updateCounterRepository = new UpdateCounterRepository(controllerInput.dbConnection, { session })
    const retrieveAllCounterRepository = new RetrieveAllCounterRepository(controllerInput.dbConnection, { session })
    // 3. handle business rules
    // 3.1 check authenticated user
    const verifyTokenResponse = await verifyUserToken(controllerInput, { session })
    // 3.2 create
    const response = await CreateItemUseCase.handle(
      {
        auth: verifyTokenResponse as IAuth,
        data: controllerInput.httpRequest.body,
      },
      {
        objClean,
        createItemRepository,
        updateCounterRepository,
        retrieveItemCategoryRepository,
        retrieveAllCounterRepository,
        schemaValidation,
      },
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
