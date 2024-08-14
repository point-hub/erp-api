import express, { Express } from 'express'

import { IBaseAppInput } from './app'
import countersRouter from './modules/counters/router'
import healthRouter from './modules/health/router'
import allocationGroupsRouter from './modules/master/allocation-groups/router'
import allocationsRouter from './modules/master/allocations/router'
import branchesRouter from './modules/master/branches/router'
import chartOfAccountCategoryRouter from './modules/master/chart-of-account-categories/router'
import chartOfAccountTypeRouter from './modules/master/chart-of-account-types/router'
import chartOfAccountRouter from './modules/master/chart-of-accounts/router'
import customerGroupsRouter from './modules/master/customer-groups/router'
import customersRouter from './modules/master/customers/router'
import itemCategoriesRouter from './modules/master/item-categories/router'
import itemsRouter from './modules/master/items/router'
import permissionsRouter from './modules/master/permissions/router'
import rolesRouter from './modules/master/roles/router'
import settingJournalsRouter from './modules/master/setting-journals/router'
import supplierGroupsRouter from './modules/master/supplier-groups/router'
import suppliersRouter from './modules/master/suppliers/router'
import userRouter from './modules/master/users/router'
import authRouter from './modules/master/users/router-auth'
import warehousesRouter from './modules/master/warehouses/router'

export default async function (baseRouterInput: IBaseAppInput) {
  const app: Express = express()

  /**
   * Register all available modules
   * <modules>/router.ts
   */
  app.use('/v1/health', await healthRouter(baseRouterInput))
  app.use('/v1/users', await userRouter(baseRouterInput))
  app.use('/v1/auth', await authRouter(baseRouterInput))
  app.use('/v1/permissions', await permissionsRouter(baseRouterInput))
  app.use('/v1/roles', await rolesRouter(baseRouterInput))
  app.use('/v1/branches', await branchesRouter(baseRouterInput))
  app.use('/v1/warehouses', await warehousesRouter(baseRouterInput))
  app.use('/v1/supplier-groups', await supplierGroupsRouter(baseRouterInput))
  app.use('/v1/suppliers', await suppliersRouter(baseRouterInput))
  app.use('/v1/chart-of-account-types', await chartOfAccountTypeRouter(baseRouterInput))
  app.use('/v1/chart-of-account-categories', await chartOfAccountCategoryRouter(baseRouterInput))
  app.use('/v1/chart-of-accounts', await chartOfAccountRouter(baseRouterInput))
  app.use('/v1/setting-journals', await settingJournalsRouter(baseRouterInput))
  app.use('/v1/customer-groups', await customerGroupsRouter(baseRouterInput))
  app.use('/v1/customers', await customersRouter(baseRouterInput))
  app.use('/v1/allocation-groups', await allocationGroupsRouter(baseRouterInput))
  app.use('/v1/allocations', await allocationsRouter(baseRouterInput))
  app.use('/v1/item-categories', await itemCategoriesRouter(baseRouterInput))
  app.use('/v1/items', await itemsRouter(baseRouterInput))
  app.use('/v1/counters', await countersRouter(baseRouterInput))

  return app
}
