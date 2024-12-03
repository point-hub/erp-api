import { objClean, tokenGenerate } from '@point-hub/express-utils'
import type { IController, IControllerInput } from '@point-hub/papi'

import { IAuth } from '@/modules/master/users/interface'
import { verifyUserToken } from '@/modules/master/users/utils/verify-user-token'
import { schemaValidation } from '@/utils/validation'

import { UpdatePurchaseOrderInvoice } from '../../purchase-orders/utils/update-invoice'
import { CreatePurchaseInvoiceRepository } from '../repositories/create.repository'
import { UpdatePurchaseInvoiceRepository } from '../repositories/update.repository'
import { UpdatePurchaseInvoiceUseCase } from '../use-cases/update.use-case'

export const updatePurchaseInvoiceController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const updatePurchaseInvoiceRepository = new UpdatePurchaseInvoiceRepository(controllerInput.dbConnection, {
      session,
    })
    const createPurchaseInvoiceRepository = new CreatePurchaseInvoiceRepository(controllerInput.dbConnection, {
      session,
    })
    const updatePurchaseOrderInvoice = new UpdatePurchaseOrderInvoice(controllerInput.dbConnection, { session })
    // 3. handle business rules
    // 3.1 check authenticated user
    const verifyTokenResponse = await verifyUserToken(controllerInput, { session })
    // 3.2 update
    const response = await UpdatePurchaseInvoiceUseCase.handle(
      {
        auth: verifyTokenResponse as IAuth,
        _id: controllerInput.httpRequest.params.id,
        data: controllerInput.httpRequest.body,
      },
      {
        objClean,
        schemaValidation,
        createPurchaseInvoiceRepository,
        updatePurchaseInvoiceRepository,
        updatePurchaseOrderInvoice,
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
