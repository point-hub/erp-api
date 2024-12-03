import type { IController, IControllerInput } from '@point-hub/papi'

import { verifyUserToken } from '@/modules/master/users/utils/verify-user-token'

import { RetrievePurchaseInvoiceRepository } from '../repositories/retrieve.repository'
import { RetrievePurchaseInvoiceUseCase } from '../use-cases/retrieve.use-case'

export const retrievePurchaseInvoiceController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const retrievePurchaseInvoiceRepository = new RetrievePurchaseInvoiceRepository(controllerInput.dbConnection, {
      session,
    })
    // 3. handle business rules
    // 3.1 check authenticated user
    await verifyUserToken(controllerInput, { session })
    // 3.2 retrieve
    const response = await RetrievePurchaseInvoiceUseCase.handle(
      { _id: controllerInput.httpRequest.params.id },
      { retrievePurchaseInvoiceRepository },
    )
    await session.commitTransaction()
    // 4. return response to client
    return {
      status: 200,
      json: {
        _id: response._id,
        form_number: response.form_number,
        required_date: response.required_date,
        required_down_payment: response.required_down_payment,
        revised_count: response.revised_count,
        purchase_order: response.purchase_order,
        supplier: response.supplier,
        branch: response.branch,
        details: response.details,
        subtotal: response.subtotal,
        discount: response.discount,
        tax_base: response.tax_base,
        tax_type: response.tax_type,
        tax: response.tax,
        total: response.total,
        notes: response.notes,
        approval_status: response.approval_status,
        approval_to: response.approval_to,
        rejected_reason: response.rejected_reason,
        created_by: response.created_by,
        updated_by: response.updated_by,
        approval_date: response.approval_date,
        created_date: response.created_date,
        updated_date: response.updated_date,
        deleted_by: response.deleted_by,
        deleted_date: response.deleted_date,
        deleted_reason: response.deleted_reason,
        is_deleted: response.is_deleted,
      },
    }
  } catch (error) {
    await session?.abortTransaction()
    throw error
  } finally {
    await session?.endSession()
  }
}
