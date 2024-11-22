import type { IController, IControllerInput } from '@point-hub/papi'

import { verifyUserToken } from '@/modules/master/users/utils/verify-user-token'
import { throwApiError } from '@/utils/throw-api-error'
import { schemaValidation } from '@/utils/validation'

import { RetrieveAllItemRepository } from '../../items/repositories/retrieve-all.repository'
import { DeleteItemCategoryRepository } from '../repositories/delete.repository'
import { RetrieveItemCategoryRepository } from '../repositories/retrieve.repository'
import { DeleteItemCategoryUseCase } from '../use-cases/delete.use-case'

export const deleteItemCategoryController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const retrieveAllItemRepository = new RetrieveAllItemRepository(controllerInput.dbConnection, { session })
    const retrieveItemCategoryRepository = new RetrieveItemCategoryRepository(controllerInput.dbConnection, { session })
    const deleteItemCategoryRepository = new DeleteItemCategoryRepository(controllerInput.dbConnection, { session })
    // 3. handle business logic
    // 3.1 check authenticated user
    await verifyUserToken(controllerInput, { session })
    // 3.2 delete
    const response = await DeleteItemCategoryUseCase.handle(
      { _id: controllerInput.httpRequest.params.id, reason: controllerInput.httpRequest.body.reason },
      {
        schemaValidation,
        deleteItemCategoryRepository,
        retrieveAllItemRepository,
        retrieveItemCategoryRepository,
        throwApiError,
      },
    )
    await session.commitTransaction()
    // 4. return response to client
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
