import { Router } from 'express'

import { IBaseAppInput } from '@/app'
import { makeController } from '@/express'

import * as controller from './controllers/index'

const makeRouter = async (routerInput: IBaseAppInput): Promise<Router> => {
  const router = Router()
  // Create Down Payment
  router.post(
    '/',
    await makeController({
      controller: controller.createDownPaymentController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  // Retrieve All Down Payment
  router.get(
    '/',
    await makeController({
      controller: controller.retrieveAllDownPaymentController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  // Retrieve Down Payment
  router.get(
    '/:id',
    await makeController({
      controller: controller.retrieveDownPaymentController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  // Update Down Payment
  router.post(
    '/:id',
    await makeController({
      controller: controller.updateDownPaymentController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  // Delete Down Payment
  router.post(
    '/:id/delete',
    await makeController({
      controller: controller.deleteDownPaymentController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  // Approve Down Payment
  router.post(
    '/:id/approve',
    await makeController({
      controller: controller.approveDownPaymentController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  // Reject Down Payment
  router.post(
    '/:id/reject',
    await makeController({
      controller: controller.rejectDownPaymentController,
      dbConnection: routerInput.dbConnection,
    }),
  )

  return router
}

export default makeRouter
