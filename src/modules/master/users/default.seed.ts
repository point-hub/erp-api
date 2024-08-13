import { type IDatabase } from '@point-hub/papi'

import { RetrieveAllRoleRepository } from '@/modules/roles/repositories/retrieve-all.repository'
import { SignupRepository } from '@/modules/master/users/repositories/signup.repository'

export interface ISeed {
  type?: string
  category?: string
  group?: string
  number?: number
  name?: string
  subledger?: string
}

export const seed = async (dbConnection: IDatabase, options: unknown) => {
  console.info(`[seed] users data`)
  // delete all data inside collection
  await dbConnection.collection('users').deleteAll(options)
  // prepare repository
  const signupRepository = new SignupRepository(dbConnection)
  const retrieveAllRoleRepository = new RetrieveAllRoleRepository(dbConnection)
  // insert new seeder data
  const roles = await retrieveAllRoleRepository.handle({}, options)
  await signupRepository.handle(
    {
      role_id: roles.data[0]._id,
      username: 'gmbtest',
      name: 'gmbtest',
      email: 'gmbtest@gmail.com',
      trimmed_username: 'gmbtest',
      trimmed_email: 'gmbtest@gmail.com',
      password: await Bun.password.hash('Admin123!'),
      is_email_verified: true,
    },
    options,
  )
}
