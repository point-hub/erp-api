import { type IDatabase } from '@point-hub/papi'

import { RetrieveAllChartOfAccountRepository } from '@/modules/master/chart-of-accounts/repositories/retrieve-all.repository'
import { CreateSettingJournalRepository } from '@/modules/master/setting-journals/repositories/create.repository'

import { ISettingJournalEntity } from './interface'

export const seed = async (dbConnection: IDatabase, options: unknown) => {
  console.info(`[seed] setting journals data`)
  // delete all data inside collection
  await dbConnection.collection('setting_journals').deleteAll(options)
  // prepare repository
  const createSettingJournalRepository = new CreateSettingJournalRepository(dbConnection)
  const retrieveAllChartOfAccountRepository = new RetrieveAllChartOfAccountRepository(dbConnection)
  // seed
  for (const feature of seeds) {
    for (const journal of feature.journals ?? []) {
      if (journal.editable) {
        const account = await retrieveAllChartOfAccountRepository.handle({ filter: { name: journal.account } }, options)
        if (account?.data?.length) {
          journal.chart_of_account_id = account.data[0]._id
        }
      }
    }
    await createSettingJournalRepository.handle(feature, options)
  }
}

export const seeds: ISettingJournalEntity[] = [
  {
    module: 'purchasing',
    feature: 'down payment',
    journals: [
      {
        account: 'down payment for purchase',
        description: 'account for down payment sent to supplier',
        position: 'debit',
        value: 1000000,
        editable: true,
        category: 'down payment for purchase',
        subledger: 'supplier',
      },
      {
        account: 'cash / bank ',
        description: 'account depends on the payment method used',
        position: 'credit',
        value: 1000000,
      },
    ],
  },
  {
    module: 'purchasing',
    feature: 'purchase invoice',
    journals: [
      {
        account: 'account payable',
        description: 'account for debt to supplier',
        position: 'credit',
        value: 484848.17,
        editable: true,
        category: 'account payable',
        subledger: 'supplier',
      },
      {
        account: 'inventory',
        description: 'account depends on master item',
        position: 'debit',
        value: 436800.16,
      },
      {
        account: 'income tax receivable',
        description: 'account for income tax receivable',
        position: 'debit',
        value: 48048.02,
        editable: true,
        category: 'income tax receivable',
      },
      {
        account: 'income from payment differences',
        description: 'account for income from payment differences',
        position: 'debit',
        value: 0,
        editable: true,
        category: 'non operational revenue',
      },
      {
        account: 'expense from payment differences',
        description: 'account for expense from payment differences',
        position: 'credit',
        value: 0.01,
        editable: true,
        category: 'non operational expense',
      },
    ],
  },
  {
    module: 'sales',
    feature: 'down payment',
    journals: [
      {
        account: 'down payment for sales',
        description: 'account for down payment received from customer',
        position: 'credit',
        value: 100000,
        editable: true,
        category: 'down payment for sales',
        subledger: 'customer',
      },
      {
        account: 'cash / bank',
        description: 'account depends on the payment method used',
        position: 'debit',
        value: 100000,
      },
    ],
  },
  {
    module: 'sales',
    feature: 'delivery notes',
    journals: [
      {
        account: 'cost of sales',
        description: 'account for cost of sales',
        position: 'debit',
        value: 100000,
        editable: true,
        category: 'cost of sales',
      },
      {
        account: 'inventory',
        description: 'account depends on master item',
        position: 'credit',
        value: 100000,
      },
    ],
  },
  {
    module: 'sales',
    feature: 'sales invoice',
    journals: [
      {
        account: 'account receivable',
        description: 'account for debt from customer',
        position: 'debit',
        value: 100000,
        editable: true,
        category: 'account receivable',
        subledger: 'customer',
      },
      {
        account: 'income tax payable',
        description: 'account for income tax payable',
        position: 'credit',
        value: 100000,
        editable: true,
        category: 'income tax payable',
      },
      {
        account: 'inventory',
        description: 'account depends on master item',
        position: 'credit',
        value: 100000,
      },
    ],
  },
  {
    module: 'inventory',
    feature: 'stock correction',
    journals: [
      {
        account: 'stock cost difference',
        description: 'account for stock cost difference',
        position: 'debit',
        value: 100000,
        editable: true,
        category: 'cost of sales',
      },
      {
        account: 'inventory',
        description: 'account depends on master item',
        position: 'credit',
        value: 100000,
      },
    ],
  },
  {
    module: 'inventory',
    feature: 'transfer item',
    journals: [
      {
        account: 'inventory in transit',
        description: 'account for inventory in transit between warehouse',
        position: 'debit',
        value: 100000,
        editable: true,
        category: 'inventory',
        subledger: 'item',
      },
      {
        account: 'inventory',
        description: 'account depends on master item',
        position: 'credit',
        value: 100000,
      },
    ],
  },
  {
    module: 'inventory',
    feature: 'receive item',
    journals: [
      {
        account: 'inventory',
        description: 'account depends on master item',
        position: 'credit',
        value: 100000,
      },
      {
        account: 'inventory in transit',
        description: 'account for inventory in transit between warehouse',
        position: 'debit',
        value: 100000,
        editable: true,
        category: 'inventory',
        subledger: 'item',
      },
      {
        account: 'stock difference',
        description: 'account for stock difference between item sent and received',
        position: 'debit',
        value: 100000,
        editable: true,
        category: 'cost of sales',
        subledger: 'item',
      },
    ],
  },
  {
    module: 'accounting',
    feature: 'cut off',
    journals: [
      {
        account: 'retained earning',
        description: 'account for retained earning',
        position: 'debit',
        value: 100000,
        editable: true,
        category: 'retained earning',
      },
    ],
  },
]
