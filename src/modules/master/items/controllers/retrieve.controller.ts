import type { IController, IControllerInput } from '@point-hub/papi'

import { verifyUserToken } from '@/modules/master/users/utils/verify-user-token'
import { RetrieveItemRepository } from '../repositories/retrieve.repository'
import { RetrieveItemUseCase } from '../use-cases/retrieve.use-case'

export const retrieveItemController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const retrieveItemRepository = new RetrieveItemRepository(controllerInput.dbConnection, { session })
    // 3. handle business rules
    // 3.1 check authenticated user
    await verifyUserToken(controllerInput, { session })
    // 3.2 retrieve
    const response = await RetrieveItemUseCase.handle(
      { _id: controllerInput.httpRequest.params.id },
      { retrieveItemRepository },
    )
    await session.commitTransaction()
    // 4. return response to client
    return {
      status: 200,
      json: {
        _id: response._id,
        chart_of_account: response.chart_of_account,
        category: response.category,
        label: response.label,
        code: response.code,
        name: response.name,
        unit: response.unit,
        have_production_number: response.have_production_number,
        have_an_expiry_date: response.have_an_expiry_date,
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
