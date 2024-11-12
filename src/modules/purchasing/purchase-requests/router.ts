import { Router } from 'express'

import { IBaseAppInput } from '@/app'
import { makeController } from '@/express'

import * as controller from './controllers/index'

const makeRouter = async (routerInput: IBaseAppInput): Promise<Router> => {
  const router = Router()

  router.post(
    '/',
    await makeController({
      controller: controller.createPurchaseRequestController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  router.get(
    '/',
    await makeController({
      controller: controller.retrieveAllPurchaseRequestController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  router.get(
    '/:id',
    await makeController({
      controller: controller.retrievePurchaseRequestController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  router.patch(
    '/:id',
    await makeController({
      controller: controller.updatePurchaseRequestController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  router.post(
    '/:id/delete',
    await makeController({
      controller: controller.deletePurchaseRequestController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  router.post(
    '/:id/approve',
    await makeController({
      controller: controller.approvePurchaseRequestController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  router.post(
    '/:id/reject',
    await makeController({
      controller: controller.rejectPurchaseRequestController,
      dbConnection: routerInput.dbConnection,
    }),
  )

  return router
}

export default makeRouter
