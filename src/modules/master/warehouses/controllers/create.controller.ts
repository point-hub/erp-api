import { objClean } from '@point-hub/express-utils'
import type { IController, IControllerInput } from '@point-hub/papi'

import authConfig from '@/config/auth'
import { RetrieveAllCounterRepository } from '@/modules/counters/repositories/retrieve-all.repository'
import { UpdateCounterRepository } from '@/modules/counters/repositories/update.repository'
import { IAuth } from '@/modules/master/users/interface'
import { RetrieveAuthUserRepository } from '@/modules/master/users/repositories/retrieve-auth-user.repository'
import { VerifyTokenUseCase } from '@/modules/master/users/use-cases/verify-token.use-case'
import { verifyToken } from '@/modules/master/users/utils/jwt'
import { throwApiError } from '@/utils/throw-api-error'
import { schemaValidation } from '@/utils/validation'

import { CreateWarehouseRepository } from '../repositories/create.repository'
import { CreateWarehouseUseCase } from '../use-cases/create.use-case'

export const createWarehouseController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const retrieveAuthUserRepository = new RetrieveAuthUserRepository(controllerInput.dbConnection)
    const createWarehouseRepository = new CreateWarehouseRepository(controllerInput.dbConnection)
    const updateRepository = new UpdateCounterRepository(controllerInput.dbConnection)
    const retrieveAllRepository = new RetrieveAllCounterRepository(controllerInput.dbConnection)
    // 3. handle business rules
    // 3.1 check authenticated user
    const verifyTokenResponse = await VerifyTokenUseCase.handle(
      {
        token: controllerInput.httpRequest.signedCookies.POINTHUB_ACCESS,
        secret: authConfig.secret,
        project_id: controllerInput.httpRequest.query.project_id,
      },
      {
        schemaValidation,
        throwApiError,
        retrieveAuthUserRepository,
        verifyToken,
      },
      { session },
    )
    // 3.2 create
    const response = await CreateWarehouseUseCase.handle(
      {
        auth: verifyTokenResponse as IAuth,
        data: controllerInput.httpRequest.body,
      },
      {
        cleanObject: objClean,
        createWarehouseRepository,
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
