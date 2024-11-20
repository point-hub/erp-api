import { type IDatabase } from '@point-hub/papi'

import { CreateManyCounterRepository } from '@/modules/counters/repositories/create-many.repository'

export interface ISeed {
  code?: string
  name?: string
  count?: number
}

export const seed = async (dbConnection: IDatabase, options: Record<string, unknown>) => {
  console.info(`[seed] counters data`)
  // delete all data inside collection
  await dbConnection.collection('counters').deleteAll(options)
  // prepare repository
  const createManyCounterRepository = new CreateManyCounterRepository(dbConnection, options)
  // insert new seeder data
  await createManyCounterRepository.handle(seeds)
}

export const seeds: ISeed[] = [
  {
    name: 'roles',
    code: 'MR',
    count: 0,
  },
  {
    name: 'branches',
    code: 'MB',
    count: 0,
  },
  {
    name: 'warehouses',
    code: 'MW',
    count: 0,
  },
  {
    name: 'machines',
    code: 'MM',
    count: 0,
  },
  {
    name: 'formulas',
    code: 'MF',
    count: 0,
  },
]
