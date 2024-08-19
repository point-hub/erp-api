import { faker } from '@faker-js/faker'
import { type IDatabase } from '@point-hub/papi'

import { CreateCounterRepository } from '@/modules/counters/repositories/create.repository'

import { CreateSupplierGroupRepository } from './repositories/create.repository'

export interface ISeed {
  code?: string
  name?: string
}

export const seed = async (dbConnection: IDatabase, options: unknown) => {
  console.info(`[seed] supplier groups data`)
  // prepare repository
  const createSupplierGroupRepository = new CreateSupplierGroupRepository(dbConnection)
  const createCounterRepository = new CreateCounterRepository(dbConnection)

  // insert new seeder data
  for (let index = 1; index <= 30; index++) {
    const seed: ISeed = {}
    seed.code = 'SG' + index.toString().padStart(2, 'X')
    seed.name = faker.location.city()
    await createSupplierGroupRepository.handle(seed, options)

    await createCounterRepository.handle(
      {
        name: 'supplier_groups',
        code: seed.code,
        count: 0,
      },
      options,
    )
  }
}
