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
    name: 'user-code',
    code: 'USER',
    count: 0,
  },
  {
    name: 'role-code',
    code: 'ROLE',
    count: 0,
  },
  {
    name: 'branch-code',
    code: 'BR',
    count: 0,
  },
  {
    name: 'warehouse-code',
    code: 'WH',
    count: 0,
  },
  {
    name: 'allocation-code',
    code: 'AL',
    count: 0,
  },
  {
    name: 'supplier-code',
    code: 'SP',
    count: 0,
  },
  {
    name: 'customer-code',
    code: 'CS',
    count: 0,
  },
  {
    name: 'item-categories',
    code: 'CAT',
    count: 0,
  },
  {
    name: 'items',
    code: 'A',
    count: 0,
  },
]
