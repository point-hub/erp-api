import type { IController, IControllerInput } from '@point-hub/papi'

import authConfig from '@/config/auth'
import { RetrieveAuthUserRepository } from '@/modules/master/users/repositories/retrieve-auth-user.repository'
import { VerifyTokenUseCase } from '@/modules/master/users/use-cases/verify-token.use-case'
import { verifyToken } from '@/modules/master/users/utils/jwt'
import { throwApiError } from '@/utils/throw-api-error'
import { schemaValidation } from '@/utils/validation'

import { RetrieveAllSupplierRepository } from '../../suppliers/repositories/retrieve-all.repository'
import { DeleteSupplierGroupRepository } from '../repositories/delete.repository'
import { DeleteSupplierGroupUseCase } from '../use-cases/delete.use-case'

export const deleteSupplierGroupController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const retrieveAuthUserRepository = new RetrieveAuthUserRepository(controllerInput.dbConnection)
    const retrieveAllSupplierRepository = new RetrieveAllSupplierRepository(controllerInput.dbConnection)
    const deleteSupplierGroupRepository = new DeleteSupplierGroupRepository(controllerInput.dbConnection)
    // 3. handle business logic
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
    // 3.2 delete
    const response = await DeleteSupplierGroupUseCase.handle(
      { _id: controllerInput.httpRequest.params.id, reason: controllerInput.httpRequest.body.reason },
      { schemaValidation, retrieveAllSupplierRepository, deleteSupplierGroupRepository, throwApiError },
      { session },
    )
    await session.commitTransaction()
    // return response to client
    return {
      status: 200,
      json: { deleted_count: response.deleted_count },
    }
  } catch (error) {
    await session?.abortTransaction()
    throw error
  } finally {
    await session?.endSession()
  }
}
