import { objClean } from '@point-hub/express-utils'
import type { IController, IControllerInput } from '@point-hub/papi'

import { CreateCounterRepository } from '@/modules/counters/repositories/create.repository'
import { RetrieveAllCounterRepository } from '@/modules/counters/repositories/retrieve-all.repository'
import { IAuth } from '@/modules/master/users/interface'
import { schemaValidation } from '@/utils/validation'

import { verifyUserToken } from '../../users/utils/verify-user-token'
import { CreateCustomerGroupRepository } from '../repositories/create.repository'
import { CreateCustomerGroupUseCase } from '../use-cases/create.use-case'

export const createCustomerGroupController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const createCustomerGroupRepository = new CreateCustomerGroupRepository(controllerInput.dbConnection, { session })
    const createCounterRepository = new CreateCounterRepository(controllerInput.dbConnection, { session })
    const retrieveAllCounterRepository = new RetrieveAllCounterRepository(controllerInput.dbConnection, { session })
    // 3. handle business rules
    // 3.1 check authenticated user
    const verifyTokenResponse = await verifyUserToken(controllerInput, { session })
    // 3.2 create
    const response = await CreateCustomerGroupUseCase.handle(
      {
        auth: verifyTokenResponse as IAuth,
        data: controllerInput.httpRequest.body,
      },
      {
        objClean,
        createCustomerGroupRepository,
        createCounterRepository,
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
