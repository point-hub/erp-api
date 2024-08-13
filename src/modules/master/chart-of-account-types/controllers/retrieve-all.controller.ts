import type { IController, IControllerInput } from '@point-hub/papi'

import { RetrieveAllChartOfAccountTypeRepository } from '../repositories/retrieve-all.repository'
import { RetrieveAllChartOfAccountTypeUseCase } from '../use-cases/retrieve-all.use-case'

export const retrieveAllChartOfAccountTypeController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const retrieveAllChartOfAccountTypeRepository = new RetrieveAllChartOfAccountTypeRepository(
      controllerInput.dbConnection,
    )
    // 3. handle business rules
    const response = await RetrieveAllChartOfAccountTypeUseCase.handle(
      { query: controllerInput.httpRequest.query },
      { retrieveAllChartOfAccountTypeRepository },
    )
    await session.commitTransaction()
    // 4. return response to client
    return {
      status: 200,
      json: {
        data: response.data,
        pagination: response.pagination,
      },
    }
  } catch (error) {
    await session?.abortTransaction()
    throw error
  } finally {
    await session?.endSession()
  }
}
