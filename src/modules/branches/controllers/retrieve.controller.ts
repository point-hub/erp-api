import type { IController, IControllerInput } from '@point-hub/papi'

import { RetrieveBranchRepository } from '../repositories/retrieve.repository'
import { RetrieveBranchUseCase } from '../use-cases/retrieve.use-case'

export const retrieveBranchController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const retrieveBranchRepository = new RetrieveBranchRepository(controllerInput.dbConnection)
    // 3. handle business rules
    const response = await RetrieveBranchUseCase.handle(
      { _id: controllerInput.httpRequest.params.id },
      { retrieveBranchRepository },
    )
    await session.commitTransaction()
    // 4. return response to client
    return {
      status: 200,
      json: {
        _id: response._id,
        code: response.code,
        name: response.name,
        address: response.address,
        phone: response.phone,
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
