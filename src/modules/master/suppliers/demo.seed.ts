import { faker } from '@faker-js/faker'
import { type IDatabase } from '@point-hub/papi'

import { RetrieveAllCounterRepository } from '@/modules/counters/repositories/retrieve-all.repository'
import { UpdateMasterNumber } from '@/modules/counters/utils/update-master-number'
import { RetrieveAllSupplierGroupRepository } from '@/modules/master/supplier-groups/repositories/retrieve-all.repository'
import { randomNumberBetween } from '@/utils/randomizer'

import { CreateSupplierRepository } from './repositories/create.repository'

export interface ISupplierGroup {
  _id: string
  label: string
  code: string
  name: string
}

export interface ISeed {
  supplier_group?: ISupplierGroup
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
  const updateMasterNumber = new UpdateMasterNumber(dbConnection, options)

  // insert new seeder data
  const supplierGroups = await retrieveAllSupplierGroupRepository.handle({ page_size: 30 })
  for (let index = 1; index <= 30; index++) {
    const supplierGroup = supplierGroups.data[randomNumberBetween(0, 29)]
    const counters = await retrieveAllCounterRepository.handle({
      filter: { name: 'suppliers', code: supplierGroup.code },
    })
    const seed: ISeed = {}
    seed.supplier_group = {
      _id: supplierGroup._id,
      code: supplierGroup.code,
      name: supplierGroup.name,
      label: supplierGroup.label,
    }
    seed.code = `${supplierGroup.code}${(counters.data[0].count + 1).toString().padStart(4, '0')}`
    seed.name = `${faker.location.city()} ${index.toString().padStart(2, '0')}`
    seed.label = `${seed.code} ${seed.name}`
    await createSupplierRepository.handle(seed)
    await updateMasterNumber.handle('suppliers', supplierGroup.code)
  }
}
