import type { IController, IControllerInput } from '@point-hub/papi'

import { RetrieveCustomerRepository } from '../repositories/retrieve.repository'
import { RetrieveCustomerUseCase } from '../use-cases/retrieve.use-case'

export const retrieveCustomerController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const retrieveCustomerRepository = new RetrieveCustomerRepository(controllerInput.dbConnection)
    // 3. handle business rules
    const response = await RetrieveCustomerUseCase.handle(
      { _id: controllerInput.httpRequest.params.id },
      { retrieveCustomerRepository },
    )
    await session.commitTransaction()
    // 4. return response to client
    return {
      status: 200,
      json: {
        _id: response._id,
        customer_group: response.customer_group,
        code: response.code,
        name: response.name,
        address: response.address,
        phone: response.phone,
        email: response.email,
        notes: response.notes,
        bank_name: response.bank_name,
        bank_branch: response.bank_branch,
        bank_account_name: response.bank_account_name,
        bank_account_number: response.bank_account_number,
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
