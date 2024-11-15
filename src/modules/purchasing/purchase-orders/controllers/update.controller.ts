import { objClean } from '@point-hub/express-utils'
import type { IController, IControllerInput } from '@point-hub/papi'
import { format } from 'date-fns'

import { CreateCounterRepository } from '@/modules/counters/repositories/create.repository'
import { RetrieveAllCounterRepository } from '@/modules/counters/repositories/retrieve-all.repository'
import { UpdateCounterRepository } from '@/modules/counters/repositories/update.repository'
import { IAuth } from '@/modules/master/users/interface'
import { verifyUserToken } from '@/modules/master/users/utils/verify-user-token'
import { schemaValidation } from '@/utils/validation'

import { CreatePurchaseOrderRepository } from '../repositories/create.repository'
import { UpdatePurchaseOrderRepository } from '../repositories/update.repository'
import { UpdatePurchaseOrderUseCase } from '../use-cases/update.use-case'

export const updatePurchaseOrderController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const updatePurchaseOrderRepository = new UpdatePurchaseOrderRepository(controllerInput.dbConnection)
    const createPurchaseOrderRepository = new CreatePurchaseOrderRepository(controllerInput.dbConnection)
    const createCounterRepository = new CreateCounterRepository(controllerInput.dbConnection)
    const updateCounterRepository = new UpdateCounterRepository(controllerInput.dbConnection)
    const retrieveAllCounterRepository = new RetrieveAllCounterRepository(controllerInput.dbConnection)
    // 3. handle business rules
    // 3.1 check authenticated user
    const verifyTokenResponse = await verifyUserToken(controllerInput, session)
    // 3.2 update
    const response = await UpdatePurchaseOrderUseCase.handle(
      {
        auth: verifyTokenResponse as IAuth,
        _id: controllerInput.httpRequest.params.id,
        data: controllerInput.httpRequest.body,
      },
      {
        cleanObject: objClean,
        createCounterRepository,
        updateCounterRepository,
        retrieveAllCounterRepository,
        schemaValidation,
        dateFormat: format,
        createPurchaseOrderRepository,
        updatePurchaseOrderRepository,
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
