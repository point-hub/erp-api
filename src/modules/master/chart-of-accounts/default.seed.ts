import { type IDatabase } from '@point-hub/papi'

import { CreateChartOfAccountCategoryRepository } from '@/modules/master/chart-of-account-categories/repositories/create.repository'
import { CreateChartOfAccountTypeRepository } from '@/modules/master/chart-of-account-types/repositories/create.repository'
import { CreateChartOfAccountRepository } from '@/modules/master/chart-of-accounts/repositories/create.repository'

export interface ISeed {
  type?: string
  category?: string
  group?: string
  number?: number
  name?: string
  subledger?: string
}

export const seed = async (dbConnection: IDatabase, options: unknown) => {
  console.info(`[seed] chart of accounts data`)
  // delete all data inside collection
  await dbConnection.collection('chart_of_accounts').deleteAll(options)
  await dbConnection.collection('chart_of_account_categories').deleteAll(options)
  await dbConnection.collection('chart_of_account_types').deleteAll(options)
  // prepare repository
  const createChartOfAccountTypeRepository = new CreateChartOfAccountTypeRepository(dbConnection)
  const createChartOfAccountCategoryRepository = new CreateChartOfAccountCategoryRepository(dbConnection)
  const createChartOfAccountRepository = new CreateChartOfAccountRepository(dbConnection)
  // insert new seeder data
  const uniqueTypes = [...new Map(seeds.map((el) => [el.type, el])).values()]
  const types = uniqueTypes.map((el) => el.type)
  for (const type of types) {
    // insert account type
    const typeResponse = await createChartOfAccountTypeRepository.handle({ name: type }, options)
    const filteredCategorySeeds = seeds.filter((el) => el.type === type)
    const uniqueCategories = [...new Map(filteredCategorySeeds.map((el) => [el.category, el])).values()]
    const categories = uniqueCategories.map((el) => el.category)
    for (const category of categories) {
      // insert account category
      const categoryResponse = await createChartOfAccountCategoryRepository.handle(
        {
          type_id: typeResponse.inserted_id,
          name: category,
        },
        options,
      )
      const filteredAccountSeeds = seeds.filter((el) => el.category === category)
      const accounts = filteredAccountSeeds.filter((el) => el.category === category)
      for (const account of accounts) {
        // insert account
        await createChartOfAccountRepository.handle(
          {
            category_id: categoryResponse.inserted_id,
            number: account.number,
            name: account.name,
            subledger: account.subledger ?? '',
          },
          options,
        )
      }
    }
  }
}

export const seeds = [
  {
    type: 'asset',
    category: 'cash',
    number: 10101,
    name: 'cash',
  },
  {
    type: 'asset',
    category: 'bank',
    number: 10201,
    name: 'bank',
  },
  {
    type: 'asset',
    category: 'supplies',
    number: 10301,
    name: 'supplies',
  },
  {
    type: 'asset',
    category: 'inventory',
    number: 10401,
    name: 'raw material inventory',
    subledger: 'item',
  },
  {
    type: 'asset',
    category: 'inventory',
    number: 10402,
    name: 'indirect material inventory',
    subledger: 'item',
  },
  {
    type: 'asset',
    category: 'inventory',
    number: 10403,
    name: 'work in process inventory',
    subledger: 'item',
  },
  {
    type: 'asset',
    category: 'inventory',
    number: 10404,
    name: 'finished good inventory',
    subledger: 'item',
  },
  {
    type: 'asset',
    category: 'inventory',
    number: 10405,
    name: 'inventory in distribution',
    subledger: 'item',
  },
  {
    type: 'asset',
    category: 'note receivable',
    number: 10501,
    name: 'note receivable',
    subledger: 'customer',
  },
  {
    type: 'asset',
    category: 'account receivable',
    number: 10502,
    name: 'account receivable',
    subledger: 'customer',
  },
  {
    type: 'asset',
    category: 'account receivable of management',
    number: 10503,
    name: 'account receivable of management',
  },
  {
    type: 'asset',
    category: 'account receivable of employee',
    number: 10504,
    name: 'account receivable of employee',
  },
  {
    type: 'asset',
    category: 'other account receivable',
    number: 10599,
    name: 'other account receivable',
  },
  {
    type: 'asset',
    category: 'purchase down payment',
    number: 10601,
    name: 'purchase down payment',
    subledger: 'supplier',
  },
  {
    type: 'asset',
    category: 'purchase down payment',
    number: 10602,
    name: 'expedition down payment',
    subledger: 'expedition',
  },
  {
    type: 'asset',
    category: 'asset down payment',
    number: 10603,
    name: 'fixed asset down payment',
    subledger: 'supplier',
  },
  {
    type: 'asset',
    category: 'income tax receivable',
    number: 10701,
    name: 'income tax receivable',
  },
  {
    type: 'asset',
    category: 'other current asset',
    number: 10801,
    name: 'marketable securities',
  },
  {
    type: 'asset',
    category: 'other current asset',
    number: 10901,
    name: 'prepaid advertising',
  },
  {
    type: 'asset',
    category: 'other current asset',
    number: 10902,
    name: 'prepaid rent',
  },
  {
    type: 'asset',
    category: 'other current asset',
    number: 10903,
    name: 'prepaid insurance',
  },
  {
    type: 'asset',
    category: 'fixed asset',
    number: 11101,
    name: 'land',
    subledger: 'fixed asset',
  },
  {
    type: 'asset',
    category: 'fixed asset',
    number: 11202,
    name: 'factory building',
    subledger: 'fixed asset',
  },
  {
    type: 'asset',
    category: 'fixed asset depreciation',
    number: 11203,
    name: 'accumulated depreciation of factory building',
    subledger: 'fixed asset',
  },
  {
    type: 'asset',
    category: 'fixed asset',
    number: 11301,
    name: 'office building',
    subledger: 'fixed asset',
  },
  {
    type: 'asset',
    category: 'fixed asset depreciation',
    number: 11302,
    name: 'accumulated depreciation of office building',
    subledger: 'fixed asset',
  },
  {
    type: 'asset',
    category: 'fixed asset',
    number: 11401,
    name: 'machine',
    subledger: 'fixed asset',
  },
  {
    type: 'asset',
    category: 'fixed asset depreciation',
    number: 11402,
    name: 'accumulated depreciation of machine',
    subledger: 'fixed asset',
  },
  {
    type: 'asset',
    category: 'fixed asset',
    number: 11501,
    name: 'equipment',
    subledger: 'fixed asset',
  },
  {
    type: 'asset',
    category: 'fixed asset depreciation',
    number: 11502,
    name: 'accumulated deprecition of equipment',
    subledger: 'fixed asset',
  },
  {
    type: 'asset',
    category: 'fixed asset',
    number: 11601,
    name: 'factory vehicle',
    subledger: 'fixed asset',
  },
  {
    type: 'asset',
    category: 'fixed asset depreciation',
    number: 11602,
    name: 'accumulated depreciation of factory vehicle',
    subledger: 'fixed asset',
  },
  {
    type: 'asset',
    category: 'fixed asset',
    number: 11701,
    name: 'office vehicle',
    subledger: 'fixed asset',
  },
  {
    type: 'asset',
    category: 'fixed asset depreciation',
    number: 11702,
    name: 'accumulated depreciation of office vehicle',
    subledger: 'fixed asset',
  },
  {
    type: 'asset',
    category: 'other assets',
    number: 11801,
    name: 'intangible fixed assets',
    subledger: 'fixed asset',
  },
  {
    type: 'asset',
    category: 'other assets amortization',
    number: 11802,
    name: 'accumulated amortized of intangble fixed assets',
    subledger: 'fixed asset',
  },
  {
    type: 'liability',
    category: 'note payable',
    number: 20101,
    name: 'note payable',
  },
  {
    type: 'liability',
    category: 'account payable',
    number: 20201,
    name: 'account payable',
    subledger: 'supplier',
  },
  {
    type: 'liability',
    category: 'sales down payment',
    number: 20301,
    name: 'sales down payment',
    subledger: 'customer',
  },
  {
    type: 'liability',
    category: 'asset sales down payment',
    number: 20302,
    name: 'asset sales down payment',
    subledger: 'customer',
  },
  {
    type: 'liability',
    category: 'income tax payable',
    number: 20401,
    name: 'income tax payable',
  },
  {
    type: 'liability',
    category: 'other current liability',
    number: 20501,
    name: 'account payable expedition',
    subledger: 'expedition',
  },
  {
    type: 'liability',
    category: 'other current liability',
    number: 20503,
    name: 'account payable fixed asset',
    subledger: 'supplier',
  },
  {
    type: 'liability',
    category: 'other current liability',
    number: 20602,
    name: 'interest payable',
  },
  {
    type: 'liability',
    category: 'other current liability',
    number: 20701,
    name: 'other current payable',
  },
  {
    type: 'liability',
    category: 'long term liability',
    number: 21101,
    name: 'bank payable <bank_name>',
  },
  {
    type: 'liability',
    category: 'long term liability',
    number: 21201,
    name: 'hypotic payable',
  },
  {
    type: 'liability',
    category: 'long term liability',
    number: 21301,
    name: 'bond payable',
  },
  {
    type: 'liability',
    category: 'long term liability',
    number: 21401,
    name: 'other long term payable',
  },
  {
    type: 'equity',
    category: 'owner equity',
    number: 30101,
    name: 'stock capital',
  },
  {
    type: 'equity',
    category: 'shareholer distribution',
    number: 30102,
    name: 'dividend',
  },
  {
    type: 'equity',
    category: 'retained earning',
    number: 30103,
    name: 'retained earning',
  },
  {
    type: 'equity',
    category: 'net income for the month',
    number: 30111,
    name: 'net income for the month',
  },
  {
    type: 'equity',
    category: 'net income for the year',
    number: 30112,
    name: 'net income for the year',
  },
  {
    type: 'income',
    category: 'sales income',
    number: 40101,
    name: 'sales',
  },
  {
    type: 'income',
    category: 'sales income',
    number: 40102,
    name: 'sales return',
  },
  {
    type: 'income',
    category: 'sales income',
    number: 40103,
    name: 'sales discount',
  },
  {
    type: 'income',
    category: 'other income',
    number: 41101,
    name: 'fullfillment',
  },
  {
    type: 'income',
    category: 'other income',
    number: 41102,
    name: 'interest income',
  },
  {
    type: 'income',
    category: 'other income',
    number: 41103,
    name: 'exchange rate',
  },
  {
    type: 'income',
    category: 'other income',
    number: 41199,
    name: 'other income',
  },
  {
    type: 'income',
    category: 'other income',
    number: 41200,
    name: 'non operating income',
  },
  {
    type: 'income',
    category: 'cost of sales',
    number: 50101,
    name: 'cost of sales',
  },
  {
    type: 'expense',
    category: 'purchase discount',
    number: 50102,
    name: 'purchase discount',
  },
  {
    type: 'expense',
    category: 'direct expense',
    group: 'office',
    number: 50111,
    name: 'delivery expense',
  },
  {
    type: 'expense',
    category: 'direct expense',
    group: 'office',
    number: 50112,
    name: 'difference stock expense',
  },
  {
    type: 'expense',
    category: 'direct expense',
    group: 'office',
    number: 50113,
    name: 'salary expense',
  },
  {
    type: 'expense',
    category: 'direct expense',
    group: 'office',
    number: 50114,
    name: 'office electricity expense',
  },
  {
    type: 'expense',
    category: 'direct expense',
    group: 'office',
    number: 50115,
    name: 'office water expense',
  },
  {
    type: 'expense',
    category: 'direct expense',
    group: 'office',
    number: 50116,
    name: 'office catering expense',
  },
  {
    type: 'expense',
    category: 'direct expense',
    group: 'office',
    number: 50117,
    name: 'maintenance of office expense',
  },
  {
    type: 'expense',
    category: 'direct expense',
    group: 'office',
    number: 50118,
    name: 'office building depreciation expense',
  },
  {
    type: 'expense',
    category: 'direct expense',
    group: 'office',
    number: 50119,
    name: 'equipment depreciation expense',
  },
  {
    type: 'expense',
    category: 'direct expense',
    group: 'office',
    number: 50120,
    name: 'office vehicle depreciation expense',
  },
  {
    type: 'expense',
    category: 'direct expense',
    group: 'office',
    number: 50121,
    name: 'amortization intangible fixed assets expense',
  },
  {
    type: 'expense',
    category: 'direct expense',
    group: 'office',
    number: 50122,
    name: 'supplies expense',
  },
  {
    type: 'expense',
    category: 'direct expense',
    group: 'office',
    number: 50123,
    name: 'rent expense',
  },
  {
    type: 'expense',
    category: 'direct expense',
    group: 'office',
    number: 50124,
    name: 'insurance  expense',
  },
  {
    type: 'expense',
    category: 'direct expense',
    group: 'office',
    number: 50125,
    name: 'telephone expense',
  },
  {
    type: 'expense',
    category: 'direct expense',
    group: 'office',
    number: 50126,
    name: 'internet expense',
  },
  {
    type: 'expense',
    category: 'direct expense',
    group: 'office',
    number: 50127,
    name: 'consultant service expense',
  },
  {
    type: 'expense',
    category: 'direct expense',
    group: 'office',
    number: 50128,
    name: 'bank administration expense',
  },
  {
    type: 'expense',
    category: 'direct expense',
    group: 'office',
    number: 50129,
    name: 'interest expense',
  },
  {
    type: 'expense',
    category: 'direct expense',
    group: 'office',
    number: 50130,
    name: 'tax expense',
  },
  {
    type: 'expense',
    category: 'direct expense',
    group: 'office',
    number: 50131,
    name: 'other expense',
  },
  {
    type: 'expense',
    category: 'direct expense',
    group: 'office',
    number: 50132,
    name: 'accomodation expense',
  },
  {
    type: 'expense',
    category: 'direct expense',
    group: 'office',
    number: 50133,
    name: 'office gasoline expense',
  },
  {
    type: 'expense',
    category: 'other expense',
    group: 'office',
    number: 50134,
    name: 'non operating expense',
  },
  {
    type: 'expense',
    category: 'direct expense',
    group: 'marketing',
    number: 50135,
    name: 'entertaiment expense',
  },
  {
    type: 'expense',
    category: 'direct expense',
    group: 'marketing',
    number: 50136,
    name: 'advertising expense',
  },
  {
    type: 'expense',
    category: 'direct expense',
    group: 'marketing',
    number: 50137,
    name: 'sales commission expense',
  },
  {
    type: 'expense',
    category: 'factory overhead cost',
    group: 'factory',
    number: 50138,
    name: 'wage expense',
  },
  {
    type: 'expense',
    category: 'factory overhead cost',
    group: 'factory',
    number: 50139,
    name: 'factory gasoline expense',
  },
  {
    type: 'expense',
    category: 'factory overhead cost',
    group: 'factory',
    number: 50140,
    name: 'factory electricity expense',
  },
  {
    type: 'expense',
    category: 'factory overhead cost',
    group: 'factory',
    number: 50141,
    name: 'factory water expense',
  },
  {
    type: 'expense',
    category: 'factory overhead cost',
    group: 'factory',
    number: 50142,
    name: 'factory catering expense',
  },
  {
    type: 'expense',
    category: 'factory overhead cost',
    group: 'factory',
    number: 50143,
    name: 'maintenance of factory expense',
  },
  {
    type: 'expense',
    category: 'factory overhead cost',
    group: 'factory',
    number: 50144,
    name: 'factory building depreciation expense',
  },
  {
    type: 'expense',
    category: 'factory overhead cost',
    group: 'factory',
    number: 50145,
    name: 'machine depreciation expense',
  },
  {
    type: 'expense',
    category: 'factory overhead cost',
    group: 'factory',
    number: 50146,
    name: 'factory vehicle depreciation expense',
  },
]
