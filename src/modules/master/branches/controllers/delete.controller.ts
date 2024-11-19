import type { IController, IControllerInput } from '@point-hub/papi'

import { throwApiError } from '@/utils/throw-api-error'
import { schemaValidation } from '@/utils/validation'

import { verifyUserToken } from '@/modules/master/users/utils/verify-user-token'
import { RetrieveAllWarehouseRepository } from '../../warehouses/repositories/retrieve-all.repository'
import { DeleteBranchRepository } from '../repositories/delete.repository'
import { DeleteBranchUseCase } from '../use-cases/delete.use-case'

export const deleteBranchController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const retrieveAllWarehouseRepository = new RetrieveAllWarehouseRepository(controllerInput.dbConnection, { session })
    const deleteBranchRepository = new DeleteBranchRepository(controllerInput.dbConnection, { session })
    // 3. handle business logic
    // 3.1 check authenticated user
    await verifyUserToken(controllerInput, { session })
    // 3.2 delete
    const response = await DeleteBranchUseCase.handle(
      { _id: controllerInput.httpRequest.params.id, reason: controllerInput.httpRequest.body.reason },
      { schemaValidation, retrieveAllWarehouseRepository, deleteBranchRepository, throwApiError },
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
