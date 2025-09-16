import { objClean, tokenGenerate } from '@point-hub/express-utils'
import type { IController, IControllerInput } from '@point-hub/papi'

import { GenerateFormNumber } from '@/modules/counters/utils/generate-form-number'
import { IAuth } from '@/modules/master/users/interface'
import { verifyUserToken } from '@/modules/master/users/utils/verify-user-token'
import { schemaValidation } from '@/utils/validation'

import { UpdateReceiveOrderInvoice } from '../../receive-orders/utils/update-invoice'
import { CreatePurchaseInvoiceRepository } from '../repositories/create.repository'
import { CreatePurchaseInvoiceUseCase } from '../use-cases/create.use-case'

export const createPurchaseInvoiceController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const createPurchaseInvoiceRepository = new CreatePurchaseInvoiceRepository(controllerInput.dbConnection, {
      session,
    })
    const generateFormNumber = new GenerateFormNumber(controllerInput.dbConnection)
    const updateReceiveOrderInvoice = new UpdateReceiveOrderInvoice(controllerInput.dbConnection, { session })
    // 3. handle business rules
    // 3.1 check authenticated user
    const verifyTokenResponse = await verifyUserToken(controllerInput, { session })
    // 3.2 create
    const response = await CreatePurchaseInvoiceUseCase.handle(
      {
        auth: verifyTokenResponse as IAuth,
        data: controllerInput.httpRequest.body,
      },
      {
        objClean,
        schemaValidation,
        generateFormNumber,
        createPurchaseInvoiceRepository,
        updateReceiveOrderInvoice,
        tokenGenerate,
      },
    )
    await session.commitTransaction()
    // 4. return response to client
    return {
      status: 201,
      json: {
        inserted_id: response.inserted_id,
      },
    }
  } catch (error) {
    await session?.abortTransaction()
    throw error
  } finally {
    await session?.endSession()
  }
}
