import type { IController, IControllerInput } from '@point-hub/papi'

import { verifyUserToken } from '@/modules/master/users/utils/verify-user-token'
import { throwApiError } from '@/utils/throw-api-error'
import { schemaValidation } from '@/utils/validation'

import { RetrieveAllUserRepository } from '../../users/repositories/retrieve-all.repository'
import { DeleteRoleRepository } from '../repositories/delete.repository'
import { RetrieveRoleRepository } from '../repositories/retrieve.repository'
import { DeleteRoleUseCase } from '../use-cases/delete.use-case'

export const deleteRoleController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const retrieveAllUserRepository = new RetrieveAllUserRepository(controllerInput.dbConnection, { session })
    const retrieveRoleRepository = new RetrieveRoleRepository(controllerInput.dbConnection, { session })
    const deleteRoleRepository = new DeleteRoleRepository(controllerInput.dbConnection, { session })
    // 3. handle business logic
    // 3.1 check authenticated user
    await verifyUserToken(controllerInput, { session })
    // 3.2 delete
    const response = await DeleteRoleUseCase.handle(
      { _id: controllerInput.httpRequest.params.id, reason: controllerInput.httpRequest.body.reason },
      { schemaValidation, retrieveRoleRepository, retrieveAllUserRepository, deleteRoleRepository, throwApiError },
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
