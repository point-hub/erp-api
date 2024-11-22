import { faker } from '@faker-js/faker'
import { type IDatabase } from '@point-hub/papi'

import { RetrieveAllCounterRepository } from '@/modules/counters/repositories/retrieve-all.repository'
import { UpdateCounterRepository } from '@/modules/counters/repositories/update.repository'
import { RetrieveAllSupplierGroupRepository } from '@/modules/master/supplier-groups/repositories/retrieve-all.repository'
import { randomNumberBetween } from '@/utils/randomizer'

import { CreateSupplierRepository } from './repositories/create.repository'

export interface ISeed {
  supplier_group_id?: string
  code?: string
  name?: string
  label?: string
}

export const seed = async (dbConnection: IDatabase, options: Record<string, unknown>) => {
  console.info(`[seed] suppliers data`)
  // prepare repository
  const createSupplierRepository = new CreateSupplierRepository(dbConnection, options)
  const retrieveAllSupplierGroupRepository = new RetrieveAllSupplierGroupRepository(dbConnection, options)
  const retrieveAllCounterRepository = new RetrieveAllCounterRepository(dbConnection, options)
  const updateCounterRepository = new UpdateCounterRepository(dbConnection, options)

  // insert new seeder data
  const supplierGroups = await retrieveAllSupplierGroupRepository.handle({ page_size: 30 })
  const counters = await retrieveAllCounterRepository.handle({ filter: { name: 'supplier_groups' } })

  for (let index = 1; index <= 30; index++) {
    const seed: ISeed = {}
    seed.supplier_group_id = supplierGroups.data[randomNumberBetween(0, 29)]._id
    seed.code = `${counters.data[0].code}${(Number(counters.data[0].count) + index).toString().padStart(4, '0')}`
    seed.name = `${faker.location.city()}`
    seed.label = `${seed.code} ${seed.name}`
    await createSupplierRepository.handle(seed)
    await updateCounterRepository.handle(counters.data[0]._id, { count: Number(counters.data[0].count) + index })
  }
}
