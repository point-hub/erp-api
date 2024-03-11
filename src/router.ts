import express, { Express } from 'express'

import { IBaseAppInput } from './app'
import accountingChartOfAccountRouter from './modules/accounting-chart-of-account/router'
import exampleRouter from './modules/example/router'

export default async function (baseRouterInput: IBaseAppInput) {
  const app: Express = express()

  /**
   * Register all available modules
   * <modules>/router.ts
   */
  app.use('/v1/examples', await exampleRouter(baseRouterInput))
  app.use('/v1/accounting/chart-of-accounts', await accountingChartOfAccountRouter(baseRouterInput))

  return app
}
