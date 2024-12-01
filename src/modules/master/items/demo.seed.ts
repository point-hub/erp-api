import { faker } from '@faker-js/faker'
import { type IDatabase } from '@point-hub/papi'

import { RetrieveAllCounterRepository } from '@/modules/counters/repositories/retrieve-all.repository'
import { UpdateMasterNumber } from '@/modules/counters/utils/update-master-number'
import { RetrieveAllItemCategoryRepository } from '@/modules/master/item-categories/repositories/retrieve-all.repository'
import { randomNumberBetween } from '@/utils/randomizer'

import { RetrieveAllChartOfAccountRepository } from '../chart-of-accounts/repositories/retrieve-all.repository'
import { CreateItemRepository } from './repositories/create.repository'

export interface IItemCategory {
  _id: string
  label: string
  code: string
  name: string
}

export interface IChartOfAccount {
  _id: string
  label: string
  number: string
  name: string
}

export interface ISeed {
  category?: IItemCategory
  chart_of_account?: IChartOfAccount
  code?: string
  name?: string
  label?: string
  unit?: string
}

export const seed = async (dbConnection: IDatabase, options: Record<string, unknown>) => {
  console.info(`[seed] items data`)
  // prepare repository
  const createItemRepository = new CreateItemRepository(dbConnection, options)
  const retrieveAllItemCategoryRepository = new RetrieveAllItemCategoryRepository(dbConnection, options)
  const retrieveAllCounterRepository = new RetrieveAllCounterRepository(dbConnection, options)
  const retrieveAllChartOfAccountRepository = new RetrieveAllChartOfAccountRepository(dbConnection, options)
  const updateMasterNumber = new UpdateMasterNumber(dbConnection, options)

  // insert new seeder data
  const itemCategories = await retrieveAllItemCategoryRepository.handle({ page_size: 30 })
  const chartOfAccounts = await retrieveAllChartOfAccountRepository.handle({ page_size: 30 })

  for (let index = 1; index <= 30; index++) {
    const itemCategory = itemCategories.data[randomNumberBetween(0, 29)]
    const chartOfAccount = chartOfAccounts.data[randomNumberBetween(0, 5)]
    const counters = await retrieveAllCounterRepository.handle({
      filter: { name: 'items', code: itemCategory.code },
    })
    const seed: ISeed = {}
    seed.category = {
      _id: itemCategory._id,
      code: itemCategory.code,
      name: itemCategory.name,
      label: itemCategory.label,
    }
    seed.chart_of_account = {
      _id: chartOfAccount._id,
      number: chartOfAccount.number,
      name: chartOfAccount.name,
      label: chartOfAccount.label,
    }
    seed.code = `${itemCategory.code}${(counters.data[0].count + 1).toString().padStart(4, '0')}`
    seed.name = `${faker.location.city()} ${index.toString().padStart(2, '0')}`
    seed.unit = `pcs`
    seed.label = `[${seed.code}] ${seed.name}`
    await createItemRepository.handle(seed)
    await updateMasterNumber.handle('items', itemCategory.code)
  }
}
