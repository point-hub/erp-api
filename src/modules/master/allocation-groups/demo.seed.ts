import { faker } from '@faker-js/faker'
import { type IDatabase } from '@point-hub/papi'

import { CreateCounterRepository } from '@/modules/counters/repositories/create.repository'

import { CreateAllocationGroupRepository } from './repositories/create.repository'

export interface ISeed {
  code?: string
  name?: string
}

export const seed = async (dbConnection: IDatabase, options: unknown) => {
  console.info(`[seed] allocation groups data`)
  // prepare repository
  const createAllocationGroupRepository = new CreateAllocationGroupRepository(dbConnection)
  const createCounterRepository = new CreateCounterRepository(dbConnection)

  // insert new seeder data
  for (let index = 1; index <= 30; index++) {
    const seed: ISeed = {}
    seed.code = 'AG' + index.toString().padStart(2, 'X')
    seed.name = faker.location.city()
    await createAllocationGroupRepository.handle(seed, options)

    await createCounterRepository.handle(
      {
        name: 'allocation_groups',
        code: seed.code,
        count: 0,
      },
      options,
    )
  }
}
