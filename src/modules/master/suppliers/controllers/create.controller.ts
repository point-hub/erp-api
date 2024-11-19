import { objClean } from '@point-hub/express-utils'
import type { IController, IControllerInput } from '@point-hub/papi'

import { RetrieveAllCounterRepository } from '@/modules/counters/repositories/retrieve-all.repository'
import { UpdateCounterRepository } from '@/modules/counters/repositories/update.repository'
import { RetrieveSupplierGroupRepository } from '@/modules/master/supplier-groups/repositories/retrieve.repository'
import { IAuth } from '@/modules/master/users/interface'
import { verifyUserToken } from '@/modules/master/users/utils/verify-user-token'
import { schemaValidation } from '@/utils/validation'

import { CreateSupplierRepository } from '../repositories/create.repository'
import { CreateSupplierUseCase } from '../use-cases/create.use-case'

export const createSupplierController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const retrieveSupplierGroupRepository = new RetrieveSupplierGroupRepository(controllerInput.dbConnection, {
      session,
    })
    const createSupplierRepository = new CreateSupplierRepository(controllerInput.dbConnection, { session })
    const updateCounterRepository = new UpdateCounterRepository(controllerInput.dbConnection, { session })
    const retrieveAllCounterRepository = new RetrieveAllCounterRepository(controllerInput.dbConnection, { session })
    // 3. handle business rules
    // 3.1 check authenticated user
    const verifyTokenResponse = await verifyUserToken(controllerInput, { session })
    // 3.2 create
    const response = await CreateSupplierUseCase.handle(
      {
        auth: verifyTokenResponse as IAuth,
        data: controllerInput.httpRequest.body,
      },
      {
        objClean,
        createSupplierRepository,
        updateCounterRepository,
        retrieveSupplierGroupRepository,
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
