import type { IController, IControllerInput, IQuery } from '@point-hub/papi'

import { RetrieveAllRepository } from '../repositories/retrieve-all.repository'
import { RetrieveAllChartOfAccountUseCase } from '../use-cases/retrieve-all.use-case'

export const retrieveAllChartOfAccountController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const retrieveAllRepository = new RetrieveAllRepository(controllerInput.dbConnection)
    // 3. handle business rules
    console.log(controllerInput.httpRequest.query)
    const query: IQuery = {
      fields: (controllerInput.httpRequest.query.fields as string) ?? '',
      filter: (controllerInput.httpRequest.query.filter as object) ?? {},
      page: Number(controllerInput.httpRequest.query.page ?? 1),
      page_size: Number(controllerInput.httpRequest.query.page_size ?? 10),
      sort: (controllerInput.httpRequest.query.sort as string) ?? '',
    }
    console.log('query json', JSON.stringify(query))
    const response = await RetrieveAllChartOfAccountUseCase.handle({ query: query }, { retrieveAllRepository })
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
