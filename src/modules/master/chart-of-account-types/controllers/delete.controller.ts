import type { IController, IControllerInput } from '@point-hub/papi'

import { schemaValidation } from '@/utils/validation'

import { DeleteChartOfAccountTypeRepository } from '../repositories/delete.repository'
import { DeleteChartOfAccountTypeUseCase } from '../use-cases/delete.use-case'

export const deleteChartOfAccountTypeController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const deleteChartOfAccountTypeRepository = new DeleteChartOfAccountTypeRepository(controllerInput.dbConnection, {
      session,
    })
    // 3. handle business logic
    const response = await DeleteChartOfAccountTypeUseCase.handle(
      { _id: controllerInput.httpRequest.params.id, reason: controllerInput.httpRequest.body.reason },
      { schemaValidation, deleteChartOfAccountTypeRepository },
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
