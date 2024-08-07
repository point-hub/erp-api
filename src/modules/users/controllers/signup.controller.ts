import { objClean, tokenGenerate } from '@point-hub/express-utils'
import type { IController, IControllerInput } from '@point-hub/papi'

import { schemaValidation } from '@/utils/validation'

import { RetrieveUserRepository } from '../repositories/retrieve.repository'
import { SignupRepository } from '../repositories/signup.repository'
import { SignupUseCase } from '../use-cases/signup.use-case'

export const signupController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const signupRepository = new SignupRepository(controllerInput.dbConnection)
    const retrieveUserRepository = new RetrieveUserRepository(controllerInput.dbConnection)
    // 3. handle business rules
    const responseCreate = await SignupUseCase.handle(
      {
        pointhubSecret: controllerInput.httpRequest.headers['Pointhub-Secret'],
        data: controllerInput.httpRequest.body,
      },
      {
        signupRepository,
        retrieveUserRepository,
        cleanObject: objClean,
        schemaValidation,
        hashPassword: Bun.password.hash,
        generateVerificationCode: tokenGenerate,
      },
      { session },
    )

    await session.commitTransaction()
    // 4. return response to client
    return {
      status: 201,
      json: {
        inserted_id: responseCreate.inserted_id,
        user_info: {
          name: responseCreate.user_info.name,
          username: responseCreate.user_info.username,
          email: responseCreate.user_info.email,
        },
      },
    }
  } catch (error) {
    await session?.abortTransaction()
    throw error
  } finally {
    await session?.endSession()
  }
}
