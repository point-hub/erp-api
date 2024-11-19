import { faker } from '@faker-js/faker'
import { type IDatabase } from '@point-hub/papi'

import { CreateCounterRepository } from '@/modules/counters/repositories/create.repository'

import { CreateCustomerGroupRepository } from './repositories/create.repository'

export interface ISeed {
  code?: string
  name?: string
}

export const seed = async (dbConnection: IDatabase, options: Record<string, unknown>) => {
  console.info(`[seed] customer groups data`)
  // prepare repository
  const createCustomerGroupRepository = new CreateCustomerGroupRepository(dbConnection, options)
  const createCounterRepository = new CreateCounterRepository(dbConnection, options)

  // insert new seeder data
  for (let index = 1; index <= 30; index++) {
    const seed: ISeed = {}
    seed.code = 'CG' + index.toString().padStart(2, 'X')
    seed.name = faker.location.city()
    await createCustomerGroupRepository.handle(seed)

    await createCounterRepository.handle({
      name: 'customer_groups',
      code: seed.code,
      count: 0,
    })
  }
}
