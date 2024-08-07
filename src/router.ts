import express, { Express } from 'express'

import { IBaseAppInput } from './app'
import allocationGroupsRouter from './modules/allocation-groups/router'
import branchesRouter from './modules/branches/router'
import countersRouter from './modules/counters/router'
import customerGroupsRouter from './modules/customer-groups/router'
import rolesRouter from './modules/roles/router'
import supplierGroupsRouter from './modules/supplier-groups/router'
import warehousesRouter from './modules/warehouses/router'
// import userRouter from './modules/users/router'
// import authRouter from './modules/users/router-auth'

export default async function (baseRouterInput: IBaseAppInput) {
  const app: Express = express()

  /**
   * Register all available modules
   * <modules>/router.ts
   */
  // app.use('/v1/users', await userRouter(baseRouterInput))
  // app.use('/v1/auth', await authRouter(baseRouterInput))
  app.use('/v1/roles', await rolesRouter(baseRouterInput))
  app.use('/v1/branches', await branchesRouter(baseRouterInput))
  app.use('/v1/warehouses', await warehousesRouter(baseRouterInput))
  app.use('/v1/supplier-groups', await supplierGroupsRouter(baseRouterInput))
  app.use('/v1/customer-groups', await customerGroupsRouter(baseRouterInput))
  app.use('/v1/allocation-groups', await allocationGroupsRouter(baseRouterInput))
  app.use('/v1/counters', await countersRouter(baseRouterInput))

  return app
}
