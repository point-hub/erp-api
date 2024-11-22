import { faker } from '@faker-js/faker'
import { type IDatabase } from '@point-hub/papi'

import { RetrieveAllCounterRepository } from '@/modules/counters/repositories/retrieve-all.repository'
import { UpdateCounterRepository } from '@/modules/counters/repositories/update.repository'
import { RetrieveAllItemCategoryRepository } from '@/modules/master/item-categories/repositories/retrieve-all.repository'
import { randomNumberBetween } from '@/utils/randomizer'

import { CreateItemRepository } from './repositories/create.repository'

export interface ISeed {
  category_id?: string
  code?: string
  name?: string
}

export const seed = async (dbConnection: IDatabase, options: Record<string, unknown>) => {
  console.info(`[seed] items data`)
  // prepare repository
  const createItemRepository = new CreateItemRepository(dbConnection, options)
  const retrieveAllItemCategoryRepository = new RetrieveAllItemCategoryRepository(dbConnection, options)
  const retrieveAllCounterRepository = new RetrieveAllCounterRepository(dbConnection, options)
  const updateCounterRepository = new UpdateCounterRepository(dbConnection, options)

  // insert new seeder data
  const itemCategories = await retrieveAllItemCategoryRepository.handle({ page_size: 30 })
  const counters = await retrieveAllCounterRepository.handle({ filter: { name: 'item_categories' } })

  for (let index = 1; index <= 30; index++) {
    const seed: ISeed = {}
    seed.category_id = itemCategories.data[randomNumberBetween(0, 29)]._id
    seed.code = `${counters.data[0].code}${(Number(counters.data[0].count) + index).toString().padStart(4, '0')}`
    seed.name = `${faker.location.city()}`
    await createItemRepository.handle(seed)
    await updateCounterRepository.handle(counters.data[0]._id, { count: Number(counters.data[0].count) + index })
  }
}
