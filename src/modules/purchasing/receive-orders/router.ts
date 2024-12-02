import { Router } from 'express'

import { IBaseAppInput } from '@/app'
import { makeController } from '@/express'

import * as controller from './controllers/index'

const makeRouter = async (routerInput: IBaseAppInput): Promise<Router> => {
  const router = Router()
  // Create Receive Order
  router.post(
    '/',
    await makeController({
      controller: controller.createReceiveOrderController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  // Retrieve All Receive Order
  router.get(
    '/',
    await makeController({
      controller: controller.retrieveAllReceiveOrderController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  // Retrieve Receive Order
  router.get(
    '/:id',
    await makeController({
      controller: controller.retrieveReceiveOrderController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  // Update Receive Order
  router.post(
    '/:id',
    await makeController({
      controller: controller.updateReceiveOrderController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  // Delete Receive Order
  router.post(
    '/:id/delete',
    await makeController({
      controller: controller.deleteReceiveOrderController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  // Approve Receive Order
  router.post(
    '/:id/approve',
    await makeController({
      controller: controller.approveReceiveOrderController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  // Reject Receive Order
  router.post(
    '/:id/reject',
    await makeController({
      controller: controller.rejectReceiveOrderController,
      dbConnection: routerInput.dbConnection,
    }),
  )

  return router
}

export default makeRouter
