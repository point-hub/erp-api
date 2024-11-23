import { objClean } from '@point-hub/express-utils'
import type { IController, IControllerInput } from '@point-hub/papi'

import { GenerateMasterNumber } from '@/modules/counters/utils/generate-master-number'
import { IAuth } from '@/modules/master/users/interface'
import { verifyUserToken } from '@/modules/master/users/utils/verify-user-token'
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
    const createBranchRepository = new CreateBranchRepository(controllerInput.dbConnection, { session })
    const generateMasterNumber = new GenerateMasterNumber(controllerInput.dbConnection, { session })
    // 3. handle business rules
    // 3.1 check authenticated user
    const verifyTokenResponse = await verifyUserToken(controllerInput, { session })
    // 3.2 create
    const response = await CreateBranchUseCase.handle(
      {
        auth: verifyTokenResponse as IAuth,
        data: controllerInput.httpRequest.body,
      },
      {
        objClean,
        createBranchRepository,
        generateMasterNumber,
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
