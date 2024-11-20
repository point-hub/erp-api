import { faker } from '@faker-js/faker'
import { type IDatabase } from '@point-hub/papi'

import { RetrieveAllCounterRepository } from '@/modules/counters/repositories/retrieve-all.repository'
import { UpdateCounterRepository } from '@/modules/counters/repositories/update.repository'

import { CreatePurchaseOrderRepository } from './repositories/create.repository'

export interface ISeed {
  code?: string
  name?: string
}

export const seed = async (dbConnection: IDatabase, options: Record<string, unknown>) => {
  console.info(`[seed] purchase requests data`)
  // prepare repository
  const createPurchaseOrderRepository = new CreatePurchaseOrderRepository(dbConnection, options)
  const retrieveAllCounterRepository = new RetrieveAllCounterRepository(dbConnection, options)
  const updateCounterRepository = new UpdateCounterRepository(dbConnection, options)

  // insert new seeder data
  const counters = await retrieveAllCounterRepository.handle({ filter: { name: 'purchase_orders' } })

  for (let index = 1; index <= 30; index++) {
    const seed: ISeed = {}
    seed.code = `${counters.data[0].code}${(Number(counters.data[0].count) + index).toString().padStart(4, '0')}`
    seed.name = `${faker.location.city()}`
    await createPurchaseOrderRepository.handle(seed)
    await updateCounterRepository.handle(counters.data[0]._id, { count: Number(counters.data[0].count) + index })
  }
}
