import type { IController, IControllerInput } from '@point-hub/papi'

import { verifyUserToken } from '../../users/utils/verify-user-token'
import { RetrieveRoleRepository } from '../repositories/retrieve.repository'
import { RetrieveRoleUseCase } from '../use-cases/retrieve.use-case'

export const retrieveRoleController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const retrieveRoleRepository = new RetrieveRoleRepository(controllerInput.dbConnection, { session })
    // 3. handle business rules
    // 3.1 check authenticated user
    await verifyUserToken(controllerInput, { session })
    // 3.2 retrieve
    const response = await RetrieveRoleUseCase.handle(
      { _id: controllerInput.httpRequest.params.id },
      { retrieveRoleRepository },
    )
    await session.commitTransaction()
    // 4. return response to client
    return {
      status: 200,
      json: {
        _id: response._id,
        label: response.label,
        code: response.code,
        name: response.name,
        permission: response.permission,
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
