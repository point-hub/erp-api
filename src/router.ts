import express, { Express } from 'express'

import { IBaseAppInput } from './app'
import allocationGroupsRouter from './modules/allocation-groups/router'
import allocationsRouter from './modules/allocations/router'
import branchesRouter from './modules/branches/router'
import countersRouter from './modules/counters/router'
import customerGroupsRouter from './modules/customer-groups/router'
import customersRouter from './modules/customers/router'
import itemCategoriesRouter from './modules/item-categories/router'
import rolesRouter from './modules/roles/router'
import supplierGroupsRouter from './modules/supplier-groups/router'
import suppliersRouter from './modules/suppliers/router'
import userRouter from './modules/users/router'
import authRouter from './modules/users/router-auth'
import warehousesRouter from './modules/warehouses/router'

export default async function (baseRouterInput: IBaseAppInput) {
  const app: Express = express()

  /**
   * Register all available modules
   * <modules>/router.ts
   */
  app.use('/v1/users', await userRouter(baseRouterInput))
  app.use('/v1/auth', await authRouter(baseRouterInput))
  app.use('/v1/roles', await rolesRouter(baseRouterInput))
  app.use('/v1/branches', await branchesRouter(baseRouterInput))
  app.use('/v1/warehouses', await warehousesRouter(baseRouterInput))
  app.use('/v1/supplier-groups', await supplierGroupsRouter(baseRouterInput))
  app.use('/v1/suppliers', await suppliersRouter(baseRouterInput))
  app.use('/v1/customer-groups', await customerGroupsRouter(baseRouterInput))
  app.use('/v1/customers', await customersRouter(baseRouterInput))
  app.use('/v1/allocation-groups', await allocationGroupsRouter(baseRouterInput))
  app.use('/v1/allocations', await allocationsRouter(baseRouterInput))
  app.use('/v1/item-categories', await itemCategoriesRouter(baseRouterInput))
  app.use('/v1/counters', await countersRouter(baseRouterInput))

  return app
}
