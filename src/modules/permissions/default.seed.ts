import { type IDatabase } from '@point-hub/papi'

import { CreatePermissionRepository } from '@/modules/permissions/repositories/create.repository'

export const seed = async (dbConnection: IDatabase, options: unknown) => {
  console.info(`[seed] permissions data`)
  // delete all data inside collection
  await dbConnection.collection('permissions').deleteAll(options)
  // prepare repository
  const createPermissionRepository = new CreatePermissionRepository(dbConnection)
  // seed
  await createPermissionRepository.handle(seeds[0], options)
}

export const seeds = [
  {
    master: {
      menu: false,
      user: {
        menu: false,
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      role: {
        menu: false,
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      branch: {
        menu: false,
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      warehouse: {
        menu: false,
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      allocation: {
        menu: false,
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      supplier: {
        menu: false,
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      customer: {
        menu: false,
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      item: {
        menu: false,
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      chart_of_account: {
        menu: false,
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      setting_journal: {
        menu: false,
        read: false,
        create: false,
        update: false,
        delete: false,
      },
    },
    purchasing: {
      menu: false,
    },
  },
]
