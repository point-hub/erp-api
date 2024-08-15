import type { IController, IControllerInput } from '@point-hub/papi'

import authConfig from '@/config/auth'
import { RetrieveAuthUserRepository } from '@/modules/master/users/repositories/retrieve-auth-user.repository'
import { VerifyTokenUseCase } from '@/modules/master/users/use-cases/verify-token.use-case'
import { verifyToken } from '@/modules/master/users/utils/jwt'
import { throwApiError } from '@/utils/throw-api-error'
import { schemaValidation } from '@/utils/validation'

import { RetrieveWarehouseRepository } from '../repositories/retrieve.repository'
import { RetrieveWarehouseUseCase } from '../use-cases/retrieve.use-case'

export const retrieveWarehouseController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const retrieveAuthUserRepository = new RetrieveAuthUserRepository(controllerInput.dbConnection)
    const retrieveWarehouseRepository = new RetrieveWarehouseRepository(controllerInput.dbConnection)
    // 3. handle business rules
    // 3.1 check authenticated user
    await VerifyTokenUseCase.handle(
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
    // 3.2 retrieve
    const response = await RetrieveWarehouseUseCase.handle(
      { _id: controllerInput.httpRequest.params.id },
      { retrieveWarehouseRepository },
    )
    await session.commitTransaction()
    // 4. return response to client
    return {
      status: 200,
      json: {
        _id: response._id,
        branch: response.branch,
        code: response.code,
        name: response.name,
        address: response.address,
        phone: response.phone,
        notes: response.notes,
        created_date: response.created_date,
        updated_date: response.updated_date,
      },
    }
  } catch (error) {
    await session?.abortTransaction()
    throw error
  } finally {
    await session?.endSession()
  }
}
