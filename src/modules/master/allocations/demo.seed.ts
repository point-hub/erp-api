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
  label?: string
}

export const seed = async (dbConnection: IDatabase, options: Record<string, unknown>) => {
  console.info(`[seed] allocations data`)
  // prepare repository
  const createAllocationRepository = new CreateAllocationRepository(dbConnection, options)
  const retrieveAllAllocationGroupRepository = new RetrieveAllAllocationGroupRepository(dbConnection, options)
  const retrieveAllCounterRepository = new RetrieveAllCounterRepository(dbConnection, options)
  const updateCounterRepository = new UpdateCounterRepository(dbConnection, options)

  // insert new seeder data
  const allocationGroups = await retrieveAllAllocationGroupRepository.handle({ page_size: 30 })
  const counters = await retrieveAllCounterRepository.handle({ filter: { name: 'allocation_groups' } })

  for (let index = 1; index <= 30; index++) {
    const seed: ISeed = {}
    seed.allocation_group_id = allocationGroups.data[randomNumberBetween(0, 29)]._id
    seed.code = `${counters.data[0].code}${(Number(counters.data[0].count) + index).toString().padStart(4, '0')}`
    seed.name = `${faker.location.city()}`
    seed.label = `[${seed.code}] ${seed.name}`
    await createAllocationRepository.handle(seed)
    await updateCounterRepository.handle(counters.data[0]._id, { count: Number(counters.data[0].count) + index })
  }
}
