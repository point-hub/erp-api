import type { IController, IControllerInput } from '@point-hub/papi'

import { RetrieveAllSettingJournalRepository } from '../repositories/retrieve-all.repository'
import { RetrieveAllSettingJournalUseCase } from '../use-cases/retrieve-all.use-case'

export const retrieveAllSettingJournalController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const retrieveAllSettingJournalRepository = new RetrieveAllSettingJournalRepository(controllerInput.dbConnection)
    // 3. handle business rules
    const response = await RetrieveAllSettingJournalUseCase.handle(
      { query: controllerInput.httpRequest.query },
      { retrieveAllSettingJournalRepository },
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
