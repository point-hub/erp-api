import express, { Express } from 'express'

import { IBaseAppInput } from './app'
import countersRouter from './modules/counters/router'
import healthRouter from './modules/health/router'
// manufacture
import manufactureFormulasRouter from './modules/manufacture/formulas/router'
import manufactureMachinesRouter from './modules/manufacture/machines/router'
import manufactureProcessesRouter from './modules/manufacture/processes/router'
// master
import masterAllocationGroupsRouter from './modules/master/allocation-groups/router'
import masterAllocationsRouter from './modules/master/allocations/router'
import masterBranchesRouter from './modules/master/branches/router'
import masterChartOfAccountCategoryRouter from './modules/master/chart-of-account-categories/router'
import masterChartOfAccountTypeRouter from './modules/master/chart-of-account-types/router'
import masterChartOfAccountRouter from './modules/master/chart-of-accounts/router'
import masterCustomerGroupsRouter from './modules/master/customer-groups/router'
import masterCustomersRouter from './modules/master/customers/router'
import masterItemCategoriesRouter from './modules/master/item-categories/router'
import masterItemsRouter from './modules/master/items/router'
import masterPermissionsRouter from './modules/master/permissions/router'
import masterRolesRouter from './modules/master/roles/router'
import masterSettingJournalsRouter from './modules/master/setting-journals/router'
import masterSupplierGroupsRouter from './modules/master/supplier-groups/router'
import masterSuppliersRouter from './modules/master/suppliers/router'
import masterUserRouter from './modules/master/users/router'
import masterAuthRouter from './modules/master/users/router-auth'
import masterWarehousesRouter from './modules/master/warehouses/router'
// purchasing
import purchasingPurchaseOrdersRouter from './modules/purchasing/purchase-requests/router'
import purchasingPurchaseRequestsRouter from './modules/purchasing/purchase-requests/router'
import purchasingDownPaymentsRouter from './modules/purchasing/purchase-requests/router'
import purchasingReceiveOrdersRouter from './modules/purchasing/purchase-requests/router'
import purchasingInvoicesRouter from './modules/purchasing/purchase-requests/router'
import purchasingPaymentOrdersRouter from './modules/purchasing/purchase-requests/router'
// sales
import salesSalesQuotationsRouter from './modules/sales/sales-quotations/router'

export default async function (baseRouterInput: IBaseAppInput) {
  const app: Express = express()

  /**
   * Register all available modules
   * <modules>/router.ts
   */
  app.use('/', await healthRouter(baseRouterInput))
  app.use('/v1/counters', await countersRouter(baseRouterInput))
  app.use('/v1/health', await healthRouter(baseRouterInput))
  // master
  app.use('/v1/master/users', await masterUserRouter(baseRouterInput))
  app.use('/v1/master/auth', await masterAuthRouter(baseRouterInput))
  app.use('/v1/master/permissions', await masterPermissionsRouter(baseRouterInput))
  app.use('/v1/master/roles', await masterRolesRouter(baseRouterInput))
  app.use('/v1/master/branches', await masterBranchesRouter(baseRouterInput))
  app.use('/v1/master/warehouses', await masterWarehousesRouter(baseRouterInput))
  app.use('/v1/master/supplier-groups', await masterSupplierGroupsRouter(baseRouterInput))
  app.use('/v1/master/suppliers', await masterSuppliersRouter(baseRouterInput))
  app.use('/v1/master/chart-of-account-types', await masterChartOfAccountTypeRouter(baseRouterInput))
  app.use('/v1/master/chart-of-account-categories', await masterChartOfAccountCategoryRouter(baseRouterInput))
  app.use('/v1/master/chart-of-accounts', await masterChartOfAccountRouter(baseRouterInput))
  app.use('/v1/master/setting-journals', await masterSettingJournalsRouter(baseRouterInput))
  app.use('/v1/master/customer-groups', await masterCustomerGroupsRouter(baseRouterInput))
  app.use('/v1/master/customers', await masterCustomersRouter(baseRouterInput))
  app.use('/v1/master/allocation-groups', await masterAllocationGroupsRouter(baseRouterInput))
  app.use('/v1/master/allocations', await masterAllocationsRouter(baseRouterInput))
  app.use('/v1/master/item-categories', await masterItemCategoriesRouter(baseRouterInput))
  app.use('/v1/master/items', await masterItemsRouter(baseRouterInput))
  // purchasing
  app.use('/v1/purchasing/purchase-requests', await purchasingPurchaseRequestsRouter(baseRouterInput))
  app.use('/v1/purchasing/purchase-orders', await purchasingPurchaseOrdersRouter(baseRouterInput))
  app.use('/v1/purchasing/down-payments', await purchasingDownPaymentsRouter(baseRouterInput))
  app.use('/v1/purchasing/receive-orders', await purchasingReceiveOrdersRouter(baseRouterInput))
  app.use('/v1/purchasing/invoices', await purchasingInvoicesRouter(baseRouterInput))
  app.use('/v1/purchasing/payment-orders', await purchasingPaymentOrdersRouter(baseRouterInput))
  // sales
  app.use('/v1/sales/sales-quotations', await salesSalesQuotationsRouter(baseRouterInput))
  // manufacture
  app.use('/v1/manufacture/machines', await manufactureMachinesRouter(baseRouterInput))
  app.use('/v1/manufacture/processes', await manufactureProcessesRouter(baseRouterInput))
  app.use('/v1/manufacture/formulas', await manufactureFormulasRouter(baseRouterInput))

  return app
}
