import { Router } from 'express'

import { IBaseAppInput } from '@/app'
import { makeController } from '@/express'

import * as controller from './controllers/index'

const makeRouter = async (routerInput: IBaseAppInput): Promise<Router> => {
  const router = Router()

  router.get(
    '/',
    await makeController({
      controller: controller.retrieveAllUserController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  router.get(
    '/authorized-users',
    await makeController({
      controller: controller.retrieveAuthorizedUsersController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  router.get(
    '/:id',
    await makeController({
      controller: controller.retrieveUserController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  router.patch(
    '/:id',
    await makeController({
      controller: controller.updateUserController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  router.post(
    '/:id/delete',
    await makeController({
      controller: controller.deleteUserController,
      dbConnection: routerInput.dbConnection,
    }),
  )

  return router
}

export default makeRouter
