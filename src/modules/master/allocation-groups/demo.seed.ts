import { faker } from '@faker-js/faker'
import { type IDatabase } from '@point-hub/papi'

import { GenerateMasterNumber } from '@/modules/counters/utils/generate-master-number'

import { CreateAllocationGroupRepository } from './repositories/create.repository'

export interface ISeed {
  code?: string
  name?: string
}

export const seed = async (dbConnection: IDatabase, options: Record<string, unknown>) => {
  console.info(`[seed] allocation groups data`)
  // prepare repository
  const createAllocationGroupRepository = new CreateAllocationGroupRepository(dbConnection, options)
  const generateMasterNumber = new GenerateMasterNumber(dbConnection, options)
  // insert new seeder data
  for (let index = 1; index <= 30; index++) {
    const seed: ISeed = {}
    seed.code = 'AG' + index.toString().padStart(2, 'X')
    seed.name = faker.location.city()
    await createAllocationGroupRepository.handle(seed)
    await generateMasterNumber.handle('allocations', seed.code)
  }
}
