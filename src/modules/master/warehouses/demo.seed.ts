import { faker } from '@faker-js/faker'
import { type IDatabase } from '@point-hub/papi'

import { RetrieveAllCounterRepository } from '@/modules/counters/repositories/retrieve-all.repository'
import { UpdateMasterNumber } from '@/modules/counters/utils/update-master-number'
import { RetrieveAllBranchRepository } from '@/modules/master/branches/repositories/retrieve-all.repository'
import { randomNumberBetween } from '@/utils/randomizer'

import { CreateWarehouseRepository } from './repositories/create.repository'

export interface IBranch {
  _id: string
  label: string
  code: string
  name: string
}

export interface ISeed {
  branch?: IBranch
  code?: string
  name?: string
  label?: string
}

export const seed = async (dbConnection: IDatabase, options: Record<string, unknown>) => {
  console.info(`[seed] warehouses data`)
  // prepare repository
  const createWarehouseRepository = new CreateWarehouseRepository(dbConnection, options)
  const retrieveAllBranchRepository = new RetrieveAllBranchRepository(dbConnection, options)
  const retrieveAllCounterRepository = new RetrieveAllCounterRepository(dbConnection, options)
  const updateMasterNumber = new UpdateMasterNumber(dbConnection, options)

  // insert new seeder data
  const branches = await retrieveAllBranchRepository.handle({ page_size: 30 })
  for (let index = 1; index <= 30; index++) {
    const branch = branches.data[randomNumberBetween(0, 29)]
    const counters = await retrieveAllCounterRepository.handle({ filter: { name: 'warehouses', code: branch.code } })
    const seed: ISeed = {}
    seed.branch = {
      _id: branch._id,
      code: branch.code,
      name: branch.name,
      label: branch.label,
    }
    seed.code = `${branch.code}${(counters.data[0].count + 1).toString().padStart(4, '0')}`
    seed.name = `${faker.location.city()} ${index.toString().padStart(2, '0')}`
    seed.label = `${seed.code} ${seed.name}`
    await createWarehouseRepository.handle(seed)
    await updateMasterNumber.handle('warehouses', branch.code)
  }
}
