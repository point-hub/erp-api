import { faker } from '@faker-js/faker'
import { type IDatabase } from '@point-hub/papi'

import { RetrieveAllCounterRepository } from '@/modules/counters/repositories/retrieve-all.repository'
import { UpdateMasterNumber } from '@/modules/counters/utils/update-master-number'
import { RetrieveAllAllocationGroupRepository } from '@/modules/master/allocation-groups/repositories/retrieve-all.repository'
import { randomNumberBetween } from '@/utils/randomizer'

import { CreateAllocationRepository } from './repositories/create.repository'

export interface IAllocationGroup {
  _id: string
  label: string
  code: string
  name: string
}

export interface ISeed {
  allocation_group?: IAllocationGroup
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
  const updateMasterNumber = new UpdateMasterNumber(dbConnection, options)

  // insert new seeder data
  const allocationGroups = await retrieveAllAllocationGroupRepository.handle({ page_size: 30 })
  for (let index = 1; index <= 30; index++) {
    const allocationGroup = allocationGroups.data[randomNumberBetween(0, 29)]
    const counters = await retrieveAllCounterRepository.handle({
      filter: { name: 'allocations', code: allocationGroup.code },
    })
    const seed: ISeed = {}
    seed.allocation_group = {
      _id: allocationGroup._id,
      code: allocationGroup.code,
      name: allocationGroup.name,
      label: allocationGroup.label,
    }
    seed.code = `${allocationGroup.code}${(counters.data[0].count + 1).toString().padStart(4, '0')}`
    seed.name = `${faker.location.city()} ${index.toString().padStart(2, '0')}`
    seed.label = `${seed.code} ${seed.name}`
    await createAllocationRepository.handle(seed)
    await updateMasterNumber.handle('allocations', allocationGroup.code)
  }
}
