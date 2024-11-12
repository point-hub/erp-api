import type { IController, IControllerInput } from '@point-hub/papi'

import authConfig from '@/config/auth'
import { RetrieveAuthUserRepository } from '@/modules/master/users/repositories/retrieve-auth-user.repository'
import { VerifyTokenUseCase } from '@/modules/master/users/use-cases/verify-token.use-case'
import { verifyToken } from '@/modules/master/users/utils/jwt'
import { throwApiError } from '@/utils/throw-api-error'
import { schemaValidation } from '@/utils/validation'

import { RetrieveSalesQuotationRepository } from '../repositories/retrieve.repository'
import { RetrieveSalesQuotationUseCase } from '../use-cases/retrieve.use-case'

export const retrieveSalesQuotationController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const retrieveAuthUserRepository = new RetrieveAuthUserRepository(controllerInput.dbConnection)
    const retrieveSalesQuotationRepository = new RetrieveSalesQuotationRepository(controllerInput.dbConnection)
    // 3. handle business rules
    // 3.1 check authenticated user
    await VerifyTokenUseCase.handle(
      {
        token: controllerInput.httpRequest.signedCookies.POINTHUB_ACCESS,
        secret: authConfig.secret,
        project_id: controllerInput.httpRequest.query.project_id,
      },
      {
        schemaValidation,
        throwApiError,
        retrieveAuthUserRepository,
        verifyToken,
      },
      { session },
    )
    // 3.2 retrieve
    const response = await RetrieveSalesQuotationUseCase.handle(
      { _id: controllerInput.httpRequest.params.id },
      { retrieveSalesQuotationRepository },
    )
    await session.commitTransaction()
    // 4. return response to client
    return {
      status: 200,
      json: {
        _id: response._id,
        rev: response.rev,
        form_number: response.form_number,
        required_date: response.required_date,
        branch: response.branch,
        items: response.items,
        notes: response.notes,
        approval_to: response.approval_to,
        created_by: response.created_by,
        updated_by: response.updated_by,
        approval_date: response.approval_date,
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
