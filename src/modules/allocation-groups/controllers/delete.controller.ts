import type { IController, IControllerInput } from '@point-hub/papi'

import { schemaValidation } from '@/utils/validation'

import { DeleteAllocationGroupRepository } from '../repositories/delete.repository'
import { DeleteAllocationGroupUseCase } from '../use-cases/delete.use-case'

export const deleteAllocationGroupController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const deleteAllocationGroupRepository = new DeleteAllocationGroupRepository(controllerInput.dbConnection)
    // 3. handle business logic
    const response = await DeleteAllocationGroupUseCase.handle(
      { _id: controllerInput.httpRequest.params.id },
      { schemaValidation, deleteAllocationGroupRepository },
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
