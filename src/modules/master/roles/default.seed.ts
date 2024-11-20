import { type IDatabase } from '@point-hub/papi'

import { RetrieveAllCounterRepository } from '@/modules/counters/repositories/retrieve-all.repository'
import { UpdateCounterRepository } from '@/modules/counters/repositories/update.repository'

import { IPermissionEntity } from '../permissions/interface'
import { RetrieveAllPermissionRepository } from '../permissions/repositories/retrieve-all.repository'
import { CreateRoleRepository } from './repositories/create.repository'

export interface ISeed {
  code?: string
  name?: string
  permission?: IPermissionEntity
}

export const seed = async (dbConnection: IDatabase, options: Record<string, unknown>) => {
  console.info(`[truncate] roles data`)
  // delete all data inside collection
  await dbConnection.collection('roles').deleteAll(options)
  console.info(`[seed] roles data`)
  // prepare repository
  const createRoleRepository = new CreateRoleRepository(dbConnection, options)
  const retrieveAllpermissionRepository = new RetrieveAllPermissionRepository(dbConnection, options)
  const retrieveAllCounterRepository = new RetrieveAllCounterRepository(dbConnection, options)
  const updateCounterRepository = new UpdateCounterRepository(dbConnection, options)

  // insert new seeder data
  const permission = await retrieveAllpermissionRepository.handle({})
  replacePermission(permission, true)
  for (const seed of seeds) {
    seed.permission = permission
    await createRoleRepository.handle(seed, options)
    // update counter
    const counters = await retrieveAllCounterRepository.handle({ filter: { name: 'roles' } })
    await updateCounterRepository.handle(counters.data[0]._id, { count: Number(counters.data[0].count) + 1 })
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
