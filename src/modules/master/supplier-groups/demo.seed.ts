import { faker } from '@faker-js/faker'
import { type IDatabase } from '@point-hub/papi'

import { GenerateMasterNumber } from '@/modules/counters/utils/generate-master-number'

import { CreateSupplierGroupRepository } from './repositories/create.repository'

export interface ISeed {
  code?: string
  name?: string
  label?: string
}

export const seed = async (dbConnection: IDatabase, options: Record<string, unknown>) => {
  console.info(`[seed] supplier groups data`)
  // prepare repository
  const createSupplierGroupRepository = new CreateSupplierGroupRepository(dbConnection, options)
  const generateMasterNumber = new GenerateMasterNumber(dbConnection, options)
  // insert new seeder data
  for (let index = 1; index <= 30; index++) {
    const seed: ISeed = {}
    seed.code = 'SG' + index.toString().padStart(2, 'X')
    seed.name = faker.location.city()
    seed.label = `[${seed.code}] ${seed.name}`
    await createSupplierGroupRepository.handle(seed)
    await generateMasterNumber.handle('suppliers', seed.code)
  }
}
