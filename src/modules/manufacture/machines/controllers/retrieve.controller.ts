import type { IController, IControllerInput } from '@point-hub/papi'

import { verifyUserToken } from '@/modules/master/users/utils/verify-user-token'

import { RetrieveMachineRepository } from '../repositories/retrieve.repository'
import { RetrieveMachineUseCase } from '../use-cases/retrieve.use-case'

export const retrieveMachineController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const retrieveMachineRepository = new RetrieveMachineRepository(controllerInput.dbConnection, { session })
    // 3. handle business rules
    // 3.1 check authenticated user
    await verifyUserToken(controllerInput, { session })
    const response = await RetrieveMachineUseCase.handle(
      { _id: controllerInput.httpRequest.params.id },
      { retrieveMachineRepository },
    )
    await session.commitTransaction()
    // 4. return response to client
    return {
      status: 200,
      json: {
        _id: response._id,
        code: response.code,
        name: response.name,
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
