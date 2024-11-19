import { faker } from '@faker-js/faker'
import { type IDatabase } from '@point-hub/papi'

import { CreateCounterRepository } from '@/modules/counters/repositories/create.repository'

import { CreateItemCategoryRepository } from './repositories/create.repository'

export interface ISeed {
  code?: string
  name?: string
}

export const seed = async (dbConnection: IDatabase, options: Record<string, unknown>) => {
  console.info(`[seed] item categories data`)
  // prepare repository
  const createItemCategoryRepository = new CreateItemCategoryRepository(dbConnection, options)
  const createCounterRepository = new CreateCounterRepository(dbConnection, options)

  // insert new seeder data
  for (let index = 1; index <= 30; index++) {
    const seed: ISeed = {}
    seed.code = 'IC' + index.toString().padStart(2, 'X')
    seed.name = faker.location.city()
    await createItemCategoryRepository.handle(seed)

    await createCounterRepository.handle({
      name: 'item_categories',
      code: seed.code,
      count: 0,
    })
  }
}
