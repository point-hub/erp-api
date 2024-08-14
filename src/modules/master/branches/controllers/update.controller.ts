import type { IController, IControllerInput } from '@point-hub/papi'

import { schemaValidation } from '@/utils/validation'

import { UpdateBranchRepository } from '../repositories/update.repository'
import { UpdateBranchUseCase } from '../use-cases/update.use-case'

export const updateBranchController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const updateBranchRepository = new UpdateBranchRepository(controllerInput.dbConnection)
    // 3. handle business rules
    const response = await UpdateBranchUseCase.handle(
      {
        _id: controllerInput.httpRequest.params.id,
        data: controllerInput.httpRequest.body,
      },
      { schemaValidation, updateBranchRepository },
    )
    await session.commitTransaction()
    // 4. return response to client
    return {
      status: 200,
      json: {
        matched_count: response.matched_count,
        modified_count: response.modified_count,
      },
    }
  } catch (error) {
    await session?.abortTransaction()
    throw error
  } finally {
    await session?.endSession()
  }
}
