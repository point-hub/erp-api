import { Router } from 'express'

import { IBaseAppInput } from '@/app'
import { makeController } from '@/express'

import * as controller from './controllers/index'

const makeRouter = async (routerInput: IBaseAppInput): Promise<Router> => {
  const router = Router()

  router.post(
    '/signup',
    await makeController({
      controller: controller.signupController,
      dbConnection: routerInput.dbConnection,
    }),
  )

  router.post(
    '/signin',
    await makeController({
      controller: controller.signinController,
      dbConnection: routerInput.dbConnection,
    }),
  )

  router.post(
    '/existing-email',
    await makeController({
      controller: controller.retrieveExistingEmailController,
      dbConnection: routerInput.dbConnection,
    }),
  )

  router.post(
    '/existing-username',
    await makeController({
      controller: controller.retrieveExistingUsernameController,
      dbConnection: routerInput.dbConnection,
    }),
  )

  router.post(
    '/verify-token',
    await makeController({
      controller: controller.verifyTokenController,
      dbConnection: routerInput.dbConnection,
    }),
  )

  router.post(
    '/verify-password',
    await makeController({
      controller: controller.verifyPasswordController,
      dbConnection: routerInput.dbConnection,
    }),
  )

  return router
}

export default makeRouter
