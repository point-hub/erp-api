import { objClean } from '@point-hub/express-utils'
import type { IController, IControllerInput } from '@point-hub/papi'

import { UpdateMasterNumber } from '@/modules/counters/utils/update-master-number'
import { RetrieveAllocationGroupRepository } from '@/modules/master/allocation-groups/repositories/retrieve.repository'
import { IAuth } from '@/modules/master/users/interface'
import { verifyUserToken } from '@/modules/master/users/utils/verify-user-token'
import { schemaValidation } from '@/utils/validation'

import { CreateAllocationRepository } from '../repositories/create.repository'
import { CreateAllocationUseCase } from '../use-cases/create.use-case'

export const createAllocationController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const retrieveAllocationGroupRepository = new RetrieveAllocationGroupRepository(controllerInput.dbConnection, {
      session,
    })
    const createAllocationRepository = new CreateAllocationRepository(controllerInput.dbConnection, { session })
    const updateMasterNumber = new UpdateMasterNumber(controllerInput.dbConnection, { session })
    // 3. handle business rules
    // 3.1 check authenticated user
    const verifyTokenResponse = await verifyUserToken(controllerInput, { session })
    // 3.2 create
    const response = await CreateAllocationUseCase.handle(
      {
        auth: verifyTokenResponse as IAuth,
        data: controllerInput.httpRequest.body,
      },
      {
        objClean,
        createAllocationRepository,
        retrieveAllocationGroupRepository,
        schemaValidation,
        updateMasterNumber,
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
