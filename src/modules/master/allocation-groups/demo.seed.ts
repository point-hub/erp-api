import { faker } from '@faker-js/faker'
import { type IDatabase } from '@point-hub/papi'

import { CreateAllocationGroupRepository } from './repositories/create.repository'

export interface ISeed {
  code?: string
  name?: string
}

export const seed = async (dbConnection: IDatabase, options: unknown) => {
  console.info(`[seed] allocation groups data`)
  // prepare repository
  const createAllocationGroupRepository = new CreateAllocationGroupRepository(dbConnection)

  // insert new seeder data
  for (let index = 1; index <= 30; index++) {
    const seed: ISeed = {}
    seed.code = faker.lorem.word(4).toUpperCase()
    seed.name = faker.location.city()
    await createAllocationGroupRepository.handle(seed, options)
  }
}
