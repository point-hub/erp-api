import { type IDatabase } from '@point-hub/papi'

import { CreateChartOfAccountCategoryRepository } from '@/modules/master/chart-of-account-categories/repositories/create.repository'
import { CreateChartOfAccountTypeRepository } from '@/modules/master/chart-of-account-types/repositories/create.repository'
import { CreateChartOfAccountRepository } from '@/modules/master/chart-of-accounts/repositories/create.repository'
import { toTitleCase } from '@/utils/titlecase'

export interface ISeed {
  type?: string
  category?: string
  group?: string
  number?: string
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
    const typeResponse = await createChartOfAccountTypeRepository.handle({ name: toTitleCase(type) }, options)
    const filteredCategorySeeds = seeds.filter((el) => el.type === type)
    const uniqueCategories = [...new Map(filteredCategorySeeds.map((el) => [el.category, el])).values()]
    const categories = uniqueCategories.map((el) => el.category)
    for (const category of categories) {
      // insert account category
      const categoryResponse = await createChartOfAccountCategoryRepository.handle(
        {
          type_id: typeResponse.inserted_id,
          name: toTitleCase(category),
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
            name: toTitleCase(account.name),
            subledger: toTitleCase(account.subledger),
          },
          options,
        )
      }
    }
  }
}

export const seeds = [
  {
    type: 'aset',
    category: 'cash',
    category_alias: 'kas',
    number: '10101',
    name: 'cash',
  },
  {
    type: 'aset',
    category: 'ayat silang kas / bank',
    category_alias: 'ayat silang kas / bank',
    number: '10199',
    name: 'cash',
  },
  {
    type: 'aset',
    category: 'bank',
    number: '10201',
    name: 'bank',
  },
  {
    type: 'aset',
    category: 'peralatan',
    number: '10301',
    name: 'peralatan',
  },
  {
    type: 'aset',
    category: 'persediaan',
    number: '10401',
    name: 'persediaan bahan baku',
    subledger: 'item',
  },
  {
    type: 'aset',
    category: 'persediaan',
    number: '10402',
    name: 'persediaan setengah jadi',
    subledger: 'item',
  },
  {
    type: 'aset',
    category: 'persediaan',
    number: '10403',
    name: 'persediaan dalam proses',
    subledger: 'item',
  },
  {
    type: 'aset',
    category: 'persediaan',
    number: '10404',
    name: 'persediaan barang jadi',
    subledger: 'item',
  },
  {
    type: 'aset',
    category: 'persediaan',
    number: '10405',
    name: 'persediaan dalam perjalanan',
    subledger: 'item',
  },
  {
    type: 'aset',
    category: 'wesel tagih',
    number: '10501',
    name: 'wesel tagih',
    subledger: 'customer',
  },
  {
    type: 'aset',
    category: 'piutang usaha',
    number: '10502',
    name: 'piutang usaha',
    subledger: 'customer',
  },
  {
    type: 'aset',
    category: 'piutang direksi',
    number: '10503',
    name: 'piutang direksi',
  },
  {
    type: 'aset',
    category: 'piutang karyawan',
    number: '10504',
    name: 'piutang karyawan',
  },
  {
    type: 'aset',
    category: 'piutang lain lain',
    number: '10599',
    name: 'piutang lain lain',
  },
  {
    type: 'aset',
    category: 'uang muka pembelian',
    number: '10601',
    name: 'uang muka pembelian barang',
    subledger: 'supplier',
  },
  {
    type: 'aset',
    category: 'uang muka pembelian',
    number: '10602',
    name: 'uang muka ekspedisi',
    subledger: 'expedition',
  },
  {
    type: 'aset',
    category: 'uang muka pembelian',
    number: '10603',
    name: 'uang muka pembelian aset tetap',
    subledger: 'supplier',
  },
  {
    type: 'aset',
    category: 'ppn masukan',
    number: '10701',
    name: 'ppn masukan',
  },
  {
    type: 'aset',
    category: 'aset lancar lainnya',
    number: '10801',
    name: 'surat berharga',
  },
  {
    type: 'aset',
    category: 'aset lancar lainnya',
    number: '10901',
    name: 'iklan dibayar dimuka',
  },
  {
    type: 'aset',
    category: 'aset lancar lainnya',
    number: '10902',
    name: 'sewa dibayar dimuka',
  },
  {
    type: 'aset',
    category: 'aset lancar lainnya',
    number: '10903',
    name: 'asuransi dibayar dimuka',
  },
  {
    type: 'aset',
    category: 'aset tetap',
    number: '11101',
    name: 'tanah',
    subledger: 'fixed asset',
  },
  {
    type: 'aset',
    category: 'aset tetap',
    number: '11202',
    name: 'bangunan pabrik',
    subledger: 'fixed asset',
  },
  {
    type: 'aset',
    category: 'akumulasi penyusutan aset tetap',
    number: '11203',
    name: 'akumulasi penyusutan bangunan pabrik',
    subledger: 'fixed asset',
  },
  {
    type: 'aset',
    category: 'aset tetap',
    number: '11301',
    name: 'bangunan kantor',
    subledger: 'fixed asset',
  },
  {
    type: 'aset',
    category: 'akumulasi penyusutan aset tetap',
    number: '11302',
    name: 'akumulasi penyusutan bangunan kantor',
    subledger: 'fixed asset',
  },
  {
    type: 'aset',
    category: 'aset tetap',
    number: '11401',
    name: 'machine',
    subledger: 'fixed asset',
  },
  {
    type: 'aset',
    category: 'akumulasi penyusutan aset tetap',
    number: '11402',
    name: 'accumulated depreciation of machine',
    subledger: 'fixed asset',
  },
  {
    type: 'aset',
    category: 'aset tetap',
    number: '11501',
    name: 'equipment',
    subledger: 'fixed asset',
  },
  {
    type: 'aset',
    category: 'akumulasi penyusutan aset tetap',
    number: '11502',
    name: 'accumulated deprecition of equipment',
    subledger: 'fixed asset',
  },
  {
    type: 'aset',
    category: 'aset tetap',
    number: '11601',
    name: 'factory vehicle',
    subledger: 'fixed asset',
  },
  {
    type: 'aset',
    category: 'akumulasi penyusutan aset tetap',
    number: '11602',
    name: 'accumulated depreciation of factory vehicle',
    subledger: 'fixed asset',
  },
  {
    type: 'aset',
    category: 'aset tetap',
    number: '11701',
    name: 'office vehicle',
    subledger: 'fixed asset',
  },
  {
    type: 'aset',
    category: 'akumulasi penyusutan aset tetap',
    number: '11702',
    name: 'accumulated depreciation of office vehicle',
    subledger: 'fixed asset',
  },
  {
    type: 'aset',
    category: 'other assets',
    number: '11801',
    name: 'intangible fixed assets',
    subledger: 'fixed asset',
  },
  {
    type: 'aset',
    category: 'other assets amortization',
    number: '11802',
    name: 'accumulated amortized of intangble fixed assets',
    subledger: 'fixed asset',
  },
  {
    type: 'kewajiban',
    category: 'note payable',
    number: '20101',
    name: 'note payable',
  },
  {
    type: 'kewajiban',
    category: 'account payable',
    number: '20201',
    name: 'account payable',
    subledger: 'supplier',
  },
  {
    type: 'kewajiban',
    category: 'sales down payment',
    number: '20301',
    name: 'sales down payment',
    subledger: 'customer',
  },
  {
    type: 'kewajiban',
    category: 'asset sales down payment',
    number: '20302',
    name: 'asset sales down payment',
    subledger: 'customer',
  },
  {
    type: 'kewajiban',
    category: 'income tax payable',
    number: '20401',
    name: 'income tax payable',
  },
  {
    type: 'kewajiban',
    category: 'other current liability',
    number: '20501',
    name: 'account payable expedition',
    subledger: 'expedition',
  },
  {
    type: 'kewajiban',
    category: 'other current liability',
    number: '20503',
    name: 'account payable fixed asset',
    subledger: 'supplier',
  },
  {
    type: 'kewajiban',
    category: 'other current liability',
    number: '20602',
    name: 'interest payable',
  },
  {
    type: 'kewajiban',
    category: 'other current liability',
    number: '20701',
    name: 'other current payable',
  },
  {
    type: 'kewajiban',
    category: 'long term liability',
    number: '21101',
    name: 'bank payable <bank_name>',
  },
  {
    type: 'kewajiban',
    category: 'long term liability',
    number: '21201',
    name: 'hypotic payable',
  },
  {
    type: 'kewajiban',
    category: 'long term liability',
    number: '21301',
    name: 'bond payable',
  },
  {
    type: 'kewajiban',
    category: 'long term liability',
    number: '21401',
    name: 'other long term payable',
  },
  {
    type: 'modal',
    category: 'owner equity',
    number: '30101',
    name: 'stock capital',
  },
  {
    type: 'modal',
    category: 'shareholer distribution',
    number: '30102',
    name: 'dividend',
  },
  {
    type: 'modal',
    category: 'retained earning',
    number: '30103',
    name: 'retained earning',
  },
  {
    type: 'modal',
    category: 'net income for the month',
    number: '30111',
    name: 'net income for the month',
  },
  {
    type: 'modal',
    category: 'net income for the year',
    number: '30112',
    name: 'net income for the year',
  },
  {
    type: 'pendapatan',
    category: 'sales income',
    number: '40101',
    name: 'sales',
  },
  {
    type: 'pendapatan',
    category: 'sales income',
    number: '40102',
    name: 'sales return',
  },
  {
    type: 'pendapatan',
    category: 'sales income',
    number: '40103',
    name: 'sales discount',
  },
  {
    type: 'pendapatan',
    category: 'other income',
    number: '41101',
    name: 'income (expense) payment difference',
  },
  {
    type: 'pendapatan',
    category: 'other income',
    number: '41102',
    name: 'interest income',
  },
  {
    type: 'pendapatan',
    category: 'other income',
    number: '41103',
    name: 'exchange rate',
  },
  {
    type: 'pendapatan',
    category: 'other income',
    number: '41199',
    name: 'other income',
  },
  {
    type: 'pendapatan',
    category: 'other income',
    number: '41200',
    name: 'non operating income',
  },
  {
    type: 'pendapatan',
    category: 'cost of sales',
    number: '50101',
    name: 'cost of sales',
  },
  {
    type: 'beban',
    category: 'purchase discount',
    number: '50102',
    name: 'purchase discount',
  },
  {
    type: 'beban',
    category: 'direct expense',
    group: 'office',
    number: '50111',
    name: 'delivery expense',
  },
  {
    type: 'beban',
    category: 'direct expense',
    group: 'office',
    number: '50112',
    name: 'difference stock expense',
  },
  {
    type: 'beban',
    category: 'direct expense',
    group: 'office',
    number: '50113',
    name: 'salary expense',
  },
  {
    type: 'beban',
    category: 'direct expense',
    group: 'office',
    number: '50114',
    name: 'office electricity expense',
  },
  {
    type: 'beban',
    category: 'direct expense',
    group: 'office',
    number: '50115',
    name: 'office water expense',
  },
  {
    type: 'beban',
    category: 'direct expense',
    group: 'office',
    number: '50116',
    name: 'office catering expense',
  },
  {
    type: 'beban',
    category: 'direct expense',
    group: 'office',
    number: '50117',
    name: 'maintenance of office expense',
  },
  {
    type: 'beban',
    category: 'direct expense',
    group: 'office',
    number: '50118',
    name: 'office building depreciation expense',
  },
  {
    type: 'beban',
    category: 'direct expense',
    group: 'office',
    number: '50119',
    name: 'equipment depreciation expense',
  },
  {
    type: 'beban',
    category: 'direct expense',
    group: 'office',
    number: '50120',
    name: 'office vehicle depreciation expense',
  },
  {
    type: 'beban',
    category: 'direct expense',
    group: 'office',
    number: '50121',
    name: 'amortization intangible fixed assets expense',
  },
  {
    type: 'beban',
    category: 'direct expense',
    group: 'office',
    number: '50122',
    name: 'supplies expense',
  },
  {
    type: 'beban',
    category: 'direct expense',
    group: 'office',
    number: '50123',
    name: 'rent expense',
  },
  {
    type: 'beban',
    category: 'direct expense',
    group: 'office',
    number: '50124',
    name: 'insurance  expense',
  },
  {
    type: 'beban',
    category: 'direct expense',
    group: 'office',
    number: '50125',
    name: 'telephone expense',
  },
  {
    type: 'beban',
    category: 'direct expense',
    group: 'office',
    number: '50126',
    name: 'internet expense',
  },
  {
    type: 'beban',
    category: 'direct expense',
    group: 'office',
    number: '50127',
    name: 'consultant service expense',
  },
  {
    type: 'beban',
    category: 'direct expense',
    group: 'office',
    number: '50128',
    name: 'bank administration expense',
  },
  {
    type: 'beban',
    category: 'direct expense',
    group: 'office',
    number: '50129',
    name: 'interest expense',
  },
  {
    type: 'beban',
    category: 'direct expense',
    group: 'office',
    number: '50130',
    name: 'tax expense',
  },
  {
    type: 'beban',
    category: 'direct expense',
    group: 'office',
    number: '50131',
    name: 'other expense',
  },
  {
    type: 'beban',
    category: 'direct expense',
    group: 'office',
    number: '50132',
    name: 'accomodation expense',
  },
  {
    type: 'beban',
    category: 'direct expense',
    group: 'office',
    number: '50133',
    name: 'office gasoline expense',
  },
  {
    type: 'beban',
    category: 'other expense',
    group: 'office',
    number: '50134',
    name: 'non operating expense',
  },
  {
    type: 'beban',
    category: 'direct expense',
    group: 'marketing',
    number: '50135',
    name: 'entertaiment expense',
  },
  {
    type: 'beban',
    category: 'direct expense',
    group: 'marketing',
    number: '50136',
    name: 'advertising expense',
  },
  {
    type: 'beban',
    category: 'direct expense',
    group: 'marketing',
    number: '50137',
    name: 'sales commission expense',
  },
  {
    type: 'beban',
    category: 'factory overhead cost',
    group: 'factory',
    number: '50138',
    name: 'wage expense',
  },
  {
    type: 'beban',
    category: 'factory overhead cost',
    group: 'factory',
    number: '50139',
    name: 'factory gasoline expense',
  },
  {
    type: 'beban',
    category: 'factory overhead cost',
    group: 'factory',
    number: '50140',
    name: 'factory electricity expense',
  },
  {
    type: 'beban',
    category: 'factory overhead cost',
    group: 'factory',
    number: '50141',
    name: 'factory water expense',
  },
  {
    type: 'beban',
    category: 'factory overhead cost',
    group: 'factory',
    number: '50142',
    name: 'factory catering expense',
  },
  {
    type: 'beban',
    category: 'factory overhead cost',
    group: 'factory',
    number: '50143',
    name: 'maintenance of factory expense',
  },
  {
    type: 'beban',
    category: 'factory overhead cost',
    group: 'factory',
    number: '50144',
    name: 'factory building depreciation expense',
  },
  {
    type: 'beban',
    category: 'factory overhead cost',
    group: 'factory',
    number: '50145',
    name: 'machine depreciation expense',
  },
  {
    type: 'beban',
    category: 'factory overhead cost',
    group: 'factory',
    number: '50146',
    name: 'factory vehicle depreciation expense',
  },
]
