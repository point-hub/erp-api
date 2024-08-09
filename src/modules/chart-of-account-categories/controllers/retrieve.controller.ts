import type { IController, IControllerInput } from '@point-hub/papi'

import { RetrieveChartOfAccountCategoryRepository } from '../repositories/retrieve.repository'
import { RetrieveChartOfAccountCategoryUseCase } from '../use-cases/retrieve.use-case'

export const retrieveChartOfAccountCategoryController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const retrieveChartOfAccountCategoryRepository = new RetrieveChartOfAccountCategoryRepository(controllerInput.dbConnection)
    // 3. handle business rules
    const response = await RetrieveChartOfAccountCategoryUseCase.handle(
      { _id: controllerInput.httpRequest.params.id },
      { retrieveChartOfAccountCategoryRepository },
    )
    await session.commitTransaction()
    // 4. return response to client
    return {
      status: 200,
      json: {
        _id: response._id,
        category_id: response.category_id,
        number: response.number,
        name: response.name,
        subledger: response.subledger,
        increasing_in: response.increasing_in,
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
