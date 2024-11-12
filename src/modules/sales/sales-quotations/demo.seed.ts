import { faker } from '@faker-js/faker'
import { type IDatabase } from '@point-hub/papi'

import { RetrieveAllCounterRepository } from '@/modules/counters/repositories/retrieve-all.repository'
import { UpdateCounterRepository } from '@/modules/counters/repositories/update.repository'

import { CreateSalesQuotationRepository } from './repositories/create.repository'

export interface ISeed {
  code?: string
  name?: string
}

export const seed = async (dbConnection: IDatabase, options: unknown) => {
  console.info(`[seed] sales quotations data`)
  // prepare repository
  const createSalesQuotationRepository = new CreateSalesQuotationRepository(dbConnection)
  const retrieveAllCounterRepository = new RetrieveAllCounterRepository(dbConnection)
  const updateCounterRepository = new UpdateCounterRepository(dbConnection)

  // insert new seeder data
  const counters = await retrieveAllCounterRepository.handle({ filter: { name: 'sales_quotations' } }, options)

  for (let index = 1; index <= 30; index++) {
    const seed: ISeed = {}
    seed.code = `${counters.data[0].code}${(Number(counters.data[0].count) + index).toString().padStart(4, '0')}`
    seed.name = `${faker.location.city()}`
    await createSalesQuotationRepository.handle(seed, options)
    await updateCounterRepository.handle(
      counters.data[0]._id,
      { count: Number(counters.data[0].count) + index },
      options,
    )
  }
}
