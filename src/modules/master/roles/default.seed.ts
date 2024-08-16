import { type IDatabase } from '@point-hub/papi'

import { IPermissionEntity } from '../permissions/interface'
import { RetrieveAllPermissionRepository } from '../permissions/repositories/retrieve-all.repository'
import { CreateRoleRepository } from './repositories/create.repository'

export interface ISeed {
  code?: string
  name?: string
  permission?: IPermissionEntity
}

export const seed = async (dbConnection: IDatabase, options: unknown) => {
  console.info(`[seed] roles data`)
  // delete all data inside collection
  await dbConnection.collection('roles').deleteAll(options)
  // prepare repository
  const createRoleRepository = new CreateRoleRepository(dbConnection)
  const retrieveAllpermissionRepository = new RetrieveAllPermissionRepository(dbConnection)
  // insert new seeder data
  const permission = await retrieveAllpermissionRepository.handle({}, options)
  replacePermission(permission, true)
  for (const seed of seeds) {
    seed.permission = permission
    await createRoleRepository.handle(seed, options)
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const replacePermission = (obj: any, newValue: boolean) => {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        replacePermission(obj[key], newValue)
      } else {
        obj[key] = newValue
      }
    }
  }
}

export const seeds: ISeed[] = [
  {
    code: 'R0001',
    name: 'Super Admin',
  },
]
