import type { IController, IControllerInput } from '@point-hub/papi'

import { verifyUserToken } from '@/modules/master/users/utils/verify-user-token'

import { RetrievePurchaseRequestRepository } from '../repositories/retrieve.repository'
import { RetrievePurchaseRequestUseCase } from '../use-cases/retrieve.use-case'

export const retrievePurchaseRequestController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const retrievePurchaseRequestRepository = new RetrievePurchaseRequestRepository(controllerInput.dbConnection, {
      session,
    })
    // 3. handle business rules
    // 3.1 check authenticated user
    await verifyUserToken(controllerInput, { session })
    // 3.2 retrieve
    const response = await RetrievePurchaseRequestUseCase.handle(
      { _id: controllerInput.httpRequest.params.id },
      { retrievePurchaseRequestRepository },
    )
    await session.commitTransaction()
    // 4. return response to client
    return {
      status: 200,
      json: {
        _id: response._id,
        revised_count: response.revised_count,
        form_number: response.form_number,
        required_date: response.required_date,
        branch: response.branch,
        details: response.details,
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
