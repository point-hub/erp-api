import { type IDatabase } from '@point-hub/papi'

import { CreateManyCounterRepository } from '@/modules/counters/repositories/create-many.repository'

export interface ISeed {
  code?: string
  name?: string
  count?: number
}

export const seed = async (dbConnection: IDatabase, options: unknown) => {
  console.info(`[seed] counters data`)
  // delete all data inside collection
  await dbConnection.collection('counters').deleteAll(options)
  // prepare repository
  const createManyCounterRepository = new CreateManyCounterRepository(dbConnection)
  // insert new seeder data
  await createManyCounterRepository.handle(seeds, options)
}

export const seeds: ISeed[] = [
  {
    name: 'roles',
    code: 'R',
    count: 0,
  },
  {
    name: 'branches',
    code: 'B',
    count: 0,
  },
  {
    name: 'warehouses',
    code: 'W',
    count: 0,
  },
  {
    name: 'machines',
    code: 'W',
    count: 0,
  },
  {
    name: 'formulas',
    code: 'F',
    count: 0,
  },
]
