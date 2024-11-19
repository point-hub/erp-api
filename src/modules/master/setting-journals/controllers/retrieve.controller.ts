import type { IController, IControllerInput } from '@point-hub/papi'

import { RetrieveSettingJournalRepository } from '../repositories/retrieve.repository'
import { RetrieveSettingJournalUseCase } from '../use-cases/retrieve.use-case'

export const retrieveSettingJournalController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const retrieveSettingJournalRepository = new RetrieveSettingJournalRepository(controllerInput.dbConnection, { session })
    // 3. handle business rules
    const response = await RetrieveSettingJournalUseCase.handle(
      { _id: controllerInput.httpRequest.params.id },
      { retrieveSettingJournalRepository },
    )
    await session.commitTransaction()
    // 4. return response to client
    return {
      status: 200,
      json: {
        _id: response._id,
        module: response.module,
        feature: response.feature,
        journals: response.journals,
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
