import { faker } from '@faker-js/faker'
import { type IDatabase } from '@point-hub/papi'

import { GenerateMasterNumber } from '@/modules/counters/utils/generate-master-number'

import { CreateBranchRepository } from './repositories/create.repository'

export interface ISeed {
  code?: string
  name?: string
  label?: string
}

export const seed = async (dbConnection: IDatabase, options: Record<string, unknown>) => {
  console.info(`[seed] branches data`)
  // prepare repository
  const createBranchRepository = new CreateBranchRepository(dbConnection, options)
  const generateMasterNumber = new GenerateMasterNumber(dbConnection, options)
  // insert new seeder data
  for (let index = 1; index <= 30; index++) {
    const seed: ISeed = {}
    seed.code = 'BR' + index.toString().padStart(2, 'X')
    seed.name = `${faker.location.city()} ${index.toString().padStart(2, '0')}`
    seed.label = `${seed.code} ${seed.name}`
    await createBranchRepository.handle(seed)
    await generateMasterNumber.handle('warehouses', seed.code)
  }
}
