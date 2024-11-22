import { IControllerInput } from '@point-hub/papi'

import authConfig from '@/config/auth'
import { RetrieveAuthUserRepository } from '@/modules/master/users/repositories/retrieve-auth-user.repository'
import { VerifyTokenUseCase } from '@/modules/master/users/use-cases/verify-token.use-case'
import { verifyToken } from '@/modules/master/users/utils/jwt'
import { throwApiError } from '@/utils/throw-api-error'
import { schemaValidation } from '@/utils/validation'

export const verifyUserToken = async (controllerInput: IControllerInput, options?: Record<string, unknown>) => {
  const retrieveAuthUserRepository = new RetrieveAuthUserRepository(controllerInput.dbConnection, options)

  return await VerifyTokenUseCase.handle(
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
  )
}
