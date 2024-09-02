import { faker } from '@faker-js/faker'
import { type IDatabase } from '@point-hub/papi'

import { RetrieveAllCounterRepository } from '@/modules/counters/repositories/retrieve-all.repository'
import { UpdateCounterRepository } from '@/modules/counters/repositories/update.repository'
import { RetrieveAllBranchRepository } from '@/modules/master/branches/repositories/retrieve-all.repository'
import { randomNumberBetween } from '@/utils/randomizer'

import { CreateWarehouseRepository } from './repositories/create.repository'

export interface ISeed {
  branch_id?: string
  code?: string
  name?: string
}

export const seed = async (dbConnection: IDatabase, options: unknown) => {
  console.info(`[seed] warehouses data`)
  // prepare repository
  const createWarehouseRepository = new CreateWarehouseRepository(dbConnection)
  const retrieveAllBranchRepository = new RetrieveAllBranchRepository(dbConnection)
  const retrieveAllCounterRepository = new RetrieveAllCounterRepository(dbConnection)
  const updateCounterRepository = new UpdateCounterRepository(dbConnection)

  // insert new seeder data
  const branches = await retrieveAllBranchRepository.handle({ page_size: 30 }, options)
  const counters = await retrieveAllCounterRepository.handle({ filter: { name: 'warehouses' } }, options)

  for (let index = 1; index <= 30; index++) {
    const seed: ISeed = {}
    seed.branch_id = branches.data[randomNumberBetween(0, 29)]._id
    seed.code = `${counters.data[0].code}${(Number(counters.data[0].count) + index).toString().padStart(4, '0')}`
    seed.name = `${faker.location.city()} ${(Number(counters.data[0].count) + index).toString().padStart(2, '0')}`
    await createWarehouseRepository.handle(seed, options)
    await updateCounterRepository.handle(
      counters.data[0]._id,
      { count: Number(counters.data[0].count) + index },
      options,
    )
  }
}
