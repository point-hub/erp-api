import { faker } from '@faker-js/faker'
import { type IDatabase } from '@point-hub/papi'

import { RetrieveAllCounterRepository } from '@/modules/counters/repositories/retrieve-all.repository'
import { UpdateMasterNumber } from '@/modules/counters/utils/update-master-number'
import { RetrieveAllCustomerGroupRepository } from '@/modules/master/customer-groups/repositories/retrieve-all.repository'
import { randomNumberBetween } from '@/utils/randomizer'

import { CreateCustomerRepository } from './repositories/create.repository'

export interface ICustomerGroup {
  _id: string
  label: string
  code: string
  name: string
}

export interface ISeed {
  customer_group?: ICustomerGroup
  code?: string
  name?: string
  label?: string
}

export const seed = async (dbConnection: IDatabase, options: Record<string, unknown>) => {
  console.info(`[seed] customers data`)
  // prepare repository
  const createCustomerRepository = new CreateCustomerRepository(dbConnection, options)
  const retrieveAllCustomerGroupRepository = new RetrieveAllCustomerGroupRepository(dbConnection, options)
  const retrieveAllCounterRepository = new RetrieveAllCounterRepository(dbConnection, options)
  const updateMasterNumber = new UpdateMasterNumber(dbConnection, options)

  // insert new seeder data
  const customerGroups = await retrieveAllCustomerGroupRepository.handle({ page_size: 30 })
  for (let index = 1; index <= 30; index++) {
    const customerGroup = customerGroups.data[randomNumberBetween(0, 29)]
    const counters = await retrieveAllCounterRepository.handle({
      filter: { name: 'customers', code: customerGroup.code },
    })
    const seed: ISeed = {}
    seed.customer_group = {
      _id: customerGroup._id,
      code: customerGroup.code,
      name: customerGroup.name,
      label: customerGroup.label,
    }
    seed.code = `${customerGroup.code}${(counters.data[0].count + 1).toString().padStart(4, '0')}`
    seed.name = `${faker.location.city()} ${index.toString().padStart(2, '0')}`
    seed.label = `${seed.code} ${seed.name}`
    await createCustomerRepository.handle(seed)
    await updateMasterNumber.handle('customers', customerGroup.code)
  }
}
