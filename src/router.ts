import express, { Express } from 'express'

import { IBaseAppInput } from './app'
import countersRouter from './modules/counters/router'
import healthRouter from './modules/health/router'
import machinesRouter from './modules/manufacture/machines/router'
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
  app.use('/', await healthRouter(baseRouterInput))
  app.use('/v1/counters', await countersRouter(baseRouterInput))
  app.use('/v1/health', await healthRouter(baseRouterInput))
  app.use('/v1/master/users', await userRouter(baseRouterInput))
  app.use('/v1/master/auth', await authRouter(baseRouterInput))
  app.use('/v1/master/permissions', await permissionsRouter(baseRouterInput))
  app.use('/v1/master/roles', await rolesRouter(baseRouterInput))
  app.use('/v1/master/branches', await branchesRouter(baseRouterInput))
  app.use('/v1/master/warehouses', await warehousesRouter(baseRouterInput))
  app.use('/v1/master/supplier-groups', await supplierGroupsRouter(baseRouterInput))
  app.use('/v1/master/suppliers', await suppliersRouter(baseRouterInput))
  app.use('/v1/master/chart-of-account-types', await chartOfAccountTypeRouter(baseRouterInput))
  app.use('/v1/master/chart-of-account-categories', await chartOfAccountCategoryRouter(baseRouterInput))
  app.use('/v1/master/chart-of-accounts', await chartOfAccountRouter(baseRouterInput))
  app.use('/v1/master/setting-journals', await settingJournalsRouter(baseRouterInput))
  app.use('/v1/master/customer-groups', await customerGroupsRouter(baseRouterInput))
  app.use('/v1/master/customers', await customersRouter(baseRouterInput))
  app.use('/v1/master/allocation-groups', await allocationGroupsRouter(baseRouterInput))
  app.use('/v1/master/allocations', await allocationsRouter(baseRouterInput))
  app.use('/v1/master/item-categories', await itemCategoriesRouter(baseRouterInput))
  app.use('/v1/master/items', await itemsRouter(baseRouterInput))
  app.use('/v1/manufacture/machines', await machinesRouter(baseRouterInput))

  return app
}
