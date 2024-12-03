import { Router } from 'express'

import { IBaseAppInput } from '@/app'
import { makeController } from '@/express'

import * as controller from './controllers/index'

const makeRouter = async (routerInput: IBaseAppInput): Promise<Router> => {
  const router = Router()
  // Create Purchase Invoice
  router.post(
    '/',
    await makeController({
      controller: controller.createPurchaseInvoiceController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  // Retrieve All Purchase Invoice
  router.get(
    '/',
    await makeController({
      controller: controller.retrieveAllPurchaseInvoiceController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  // Retrieve Purchase Invoice
  router.get(
    '/:id',
    await makeController({
      controller: controller.retrievePurchaseInvoiceController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  // Update Purchase Invoice
  router.post(
    '/:id',
    await makeController({
      controller: controller.updatePurchaseInvoiceController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  // Delete Purchase Invoice
  router.post(
    '/:id/delete',
    await makeController({
      controller: controller.deletePurchaseInvoiceController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  // Approve Purchase Invoice
  router.post(
    '/:id/approve',
    await makeController({
      controller: controller.approvePurchaseInvoiceController,
      dbConnection: routerInput.dbConnection,
    }),
  )
  // Reject Purchase Invoice
  router.post(
    '/:id/reject',
    await makeController({
      controller: controller.rejectPurchaseInvoiceController,
      dbConnection: routerInput.dbConnection,
    }),
  )

  return router
}

export default makeRouter
