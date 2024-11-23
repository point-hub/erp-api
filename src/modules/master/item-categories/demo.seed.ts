import { faker } from '@faker-js/faker'
import { type IDatabase } from '@point-hub/papi'

import { GenerateMasterNumber } from '@/modules/counters/utils/generate-master-number'

import { CreateItemCategoryRepository } from './repositories/create.repository'

export interface ISeed {
  code?: string
  name?: string
  label?: string
}

export const seed = async (dbConnection: IDatabase, options: Record<string, unknown>) => {
  console.info(`[seed] item categories data`)
  // prepare repository
  const createItemCategoryRepository = new CreateItemCategoryRepository(dbConnection, options)
  const generateMasterNumber = new GenerateMasterNumber(dbConnection, options)
  // insert new seeder data
  for (let index = 1; index <= 30; index++) {
    const seed: ISeed = {}
    seed.code = 'IC' + index.toString().padStart(2, 'X')
    seed.name = faker.location.city()
    seed.label = `${seed.code} ${seed.name}`
    await createItemCategoryRepository.handle(seed)
    await generateMasterNumber.handle('items', seed.code)
  }
}
