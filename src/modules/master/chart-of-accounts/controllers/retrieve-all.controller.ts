import type { IController, IControllerInput } from '@point-hub/papi'

import { RetrieveAllChartOfAccountRepository } from '../repositories/retrieve-all.repository'
import { RetrieveAllChartOfAccountUseCase } from '../use-cases/retrieve-all.use-case'

export const retrieveAllChartOfAccountController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const retrieveAllChartOfAccountRepository = new RetrieveAllChartOfAccountRepository(controllerInput.dbConnection, { session })
    // 3. handle business rules
    const response = await RetrieveAllChartOfAccountUseCase.handle(
      { query: controllerInput.httpRequest.query },
      { retrieveAllChartOfAccountRepository },
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
