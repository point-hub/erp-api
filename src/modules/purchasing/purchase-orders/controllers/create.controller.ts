import { objClean } from '@point-hub/express-utils'
import type { IController, IControllerInput } from '@point-hub/papi'
import { format } from 'date-fns'

import { CreateCounterRepository } from '@/modules/counters/repositories/create.repository'
import { RetrieveAllCounterRepository } from '@/modules/counters/repositories/retrieve-all.repository'
import { UpdateCounterRepository } from '@/modules/counters/repositories/update.repository'
import { GenerateFormNumber } from '@/modules/counters/utils/generate-form-number'
import { IAuth } from '@/modules/master/users/interface'
import { verifyUserToken } from '@/modules/master/users/utils/verify-user-token'
import { schemaValidation } from '@/utils/validation'

import { UpdatePurchaseRequestRepository } from '../../purchase-requests/repositories/update.repository'
import { CreatePurchaseOrderRepository } from '../repositories/create.repository'
import { CreatePurchaseOrderUseCase } from '../use-cases/create.use-case'

export const createPurchaseOrderController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const createPurchaseOrderRepository = new CreatePurchaseOrderRepository(controllerInput.dbConnection)
    const updatePurchaseRequestRepository = new UpdatePurchaseRequestRepository(controllerInput.dbConnection)
    const createCounterRepository = new CreateCounterRepository(controllerInput.dbConnection)
    const updateCounterRepository = new UpdateCounterRepository(controllerInput.dbConnection)
    const retrieveAllCounterRepository = new RetrieveAllCounterRepository(controllerInput.dbConnection)
    const generateFormNumber = new GenerateFormNumber(controllerInput.dbConnection)
    // 3. handle business rules
    // 3.1 check authenticated user
    const verifyTokenResponse = await verifyUserToken(controllerInput, session)
    // 3.2 create
    const response = await CreatePurchaseOrderUseCase.handle(
      {
        auth: verifyTokenResponse as IAuth,
        data: controllerInput.httpRequest.body,
      },
      {
        cleanObject: objClean,
        createPurchaseOrderRepository,
        createCounterRepository,
        updateCounterRepository,
        retrieveAllCounterRepository,
        schemaValidation,
        generateFormNumber,
        dateFormat: format,
        updatePurchaseRequestRepository,
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
