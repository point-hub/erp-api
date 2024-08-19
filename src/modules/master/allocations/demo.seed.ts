import { faker } from '@faker-js/faker'
import { type IDatabase } from '@point-hub/papi'

import { RetrieveAllCounterRepository } from '@/modules/counters/repositories/retrieve-all.repository'
import { UpdateCounterRepository } from '@/modules/counters/repositories/update.repository'
import { RetrieveAllAllocationGroupRepository } from '@/modules/master/allocation-groups/repositories/retrieve-all.repository'
import { randomNumberBetween } from '@/utils/randomizer'

import { CreateAllocationRepository } from './repositories/create.repository'

export interface ISeed {
  allocation_group_id?: string
  code?: string
  name?: string
}

export const seed = async (dbConnection: IDatabase, options: unknown) => {
  console.info(`[seed] allocations data`)
  // prepare repository
  const createAllocationRepository = new CreateAllocationRepository(dbConnection)
  const retrieveAllAllocationGroupRepository = new RetrieveAllAllocationGroupRepository(dbConnection)
  const retrieveAllCounterRepository = new RetrieveAllCounterRepository(dbConnection)
  const updateCounterRepository = new UpdateCounterRepository(dbConnection)

  // insert new seeder data
  const allocationGroups = await retrieveAllAllocationGroupRepository.handle({ page_size: 30 }, options)
  const counters = await retrieveAllCounterRepository.handle({ filter: { name: 'allocation_groups' } }, options)

  for (let index = 1; index <= 30; index++) {
    const seed: ISeed = {}
    seed.allocation_group_id = allocationGroups.data[randomNumberBetween(0, 29)]._id
    seed.code = `${counters.data[0].code}${(Number(counters.data[0].count) + index).toString().padStart(4, '0')}`
    seed.name = `${faker.location.city()}`
    await createAllocationRepository.handle(seed, options)
    await updateCounterRepository.handle(
      counters.data[0]._id,
      { count: Number(counters.data[0].count) + index },
      options,
    )
  }
}
