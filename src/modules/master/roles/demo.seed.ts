import { faker } from '@faker-js/faker'
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

export const seed = async (dbConnection: IDatabase, options: unknown) => {
  console.info(`[seed] roles data`)
  // prepare repository
  const createRoleRepository = new CreateRoleRepository(dbConnection)
  const retrieveAllpermissionRepository = new RetrieveAllPermissionRepository(dbConnection)
  const retrieveAllCounterRepository = new RetrieveAllCounterRepository(dbConnection)
  const updateCounterRepository = new UpdateCounterRepository(dbConnection)

  // insert new seeder data
  const permission = await retrieveAllpermissionRepository.handle({}, options)
  const counters = await retrieveAllCounterRepository.handle({ filter: { name: 'roles' } }, options)
  replacePermission(permission, true)

  for (let index = 1; index <= 30; index++) {
    const seed: ISeed = {}
    seed.code = `${counters.data[0].code}${(Number(counters.data[0].count) + index).toString().padStart(4, '0')}`
    seed.name = faker.lorem.words({ min: 1, max: 3 })
    seed.permission = permission
    await createRoleRepository.handle(seed, options)
    await updateCounterRepository.handle(
      counters.data[0]._id,
      { count: Number(counters.data[0].count) + index },
      options,
    )
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
