import { type IDatabase } from '@point-hub/papi'

import { CreateRoleRepository } from '@/modules/roles/repositories/create.repository'

export interface ISeed {
  name?: string
}

export const seed = async (dbConnection: IDatabase, options: unknown) => {
  console.info(`[seed] roles data`)
  // delete all data inside collection
  await dbConnection.collection('roles').deleteAll(options)
  // prepare repository
  const createRoleRepository = new CreateRoleRepository(dbConnection)
  // insert new seeder data
  await createRoleRepository.handle(seeds[0], options)
}

export const seeds = [{ code: 'RL0001', name: 'Super Admin' }]
