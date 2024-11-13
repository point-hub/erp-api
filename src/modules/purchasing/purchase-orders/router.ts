import { Router } from 'express'

import { IBaseAppInput } from '@/app'
import { makeController } from '@/express'

import * as controller from './controllers/index'

const makeRouter = async (routerInput: IBaseAppInput): Promise<Router> => {
  const router = Router()

  router.post(
    '/',
    await makeController({
      controller: controller.createPurchaseOrderController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  router.get(
    '/',
    await makeController({
      controller: controller.retrieveAllPurchaseOrderController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  router.get(
    '/:id',
    await makeController({
      controller: controller.retrievePurchaseOrderController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  router.patch(
    '/:id',
    await makeController({
      controller: controller.updatePurchaseOrderController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  router.post(
    '/:id/delete',
    await makeController({
      controller: controller.deletePurchaseOrderController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  router.post(
    '/:id/approve',
    await makeController({
      controller: controller.approvePurchaseOrderController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  router.post(
    '/:id/reject',
    await makeController({
      controller: controller.rejectPurchaseOrderController,
      dbConnection: routerInput.dbConnection,
    }),
  )

  return router
}

export default makeRouter
