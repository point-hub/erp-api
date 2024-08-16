import { type IDatabase } from '@point-hub/papi'

import { RetrieveAllPermissionRepository } from '../permissions/repositories/retrieve-all.repository'
import { CreateRoleRepository } from './repositories/create.repository'

export interface ISeed {
  code?: string
  name?: string
  permission?: { [key: string]: boolean | { [key: string]: boolean } }
}

export const seed = async (dbConnection: IDatabase, options: unknown) => {
  console.info(`[seed] roles data`)
  // delete all data inside collection
  await dbConnection.collection('roles').deleteAll(options)
  // prepare repository
  const createRoleRepository = new CreateRoleRepository(dbConnection)
  const permissionRepository = new RetrieveAllPermissionRepository(dbConnection)
  // insert new seeder data
  for (const seed of seeds) {
    seed.permission = (await permissionRepository.handle({}, options)).data[0]
    await createRoleRepository.handle(seed, options)
  }
}

export const seeds: ISeed[] = [
  {
    code: 'R0001',
    name: 'Super Admin',
  },
]
