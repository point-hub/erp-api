import { type IDatabase } from '@point-hub/papi'

import { CreateRoleRepository } from './repositories/create.repository'

export interface ISeed {
  name?: string
}

export const seed = async (dbConnection: IDatabase, options: unknown) => {
  console.info(`[seed] roles data`)
  // delete all data inside collection
  await dbConnection.collection('roles').deleteAll(options)
  // prepare repository
  const createRoleRepository = new CreateRoleRepository(dbConnection)
  // insert new seeder data
  await createRoleRepository.handle(seeds[0], options)
}

export const seeds = [
  {
    code: 'R0001',
    name: 'Super Admin',
    permission: {
      master: {
        menu: true,
        users: {
          read: true,
          create: true,
          update: true,
          delete: true,
          approval: true,
        },
        roles: {
          read: true,
          create: true,
          update: true,
          delete: true,
          approval: true,
        },
        branches: {
          read: true,
          create: true,
          update: true,
          delete: true,
          approval: true,
        },
        warehouses: {
          read: true,
          create: true,
          update: true,
          delete: true,
          approval: true,
        },
        allocations: {
          read: true,
          create: true,
          update: true,
          delete: true,
          approval: true,
        },
        suppliers: {
          read: true,
          create: true,
          update: true,
          delete: true,
          approval: true,
        },
        customers: {
          read: true,
          create: true,
          update: true,
          delete: true,
          approval: true,
        },
        items: {
          read: true,
          create: true,
          update: true,
          delete: true,
          approval: true,
        },
        chart_of_accounts: {
          read: true,
          create: true,
          update: true,
          delete: true,
          approval: true,
        },
        setting_journals: {
          read: true,
          create: true,
          update: true,
          delete: true,
          approval: true,
        },
      },
      purchasing: {
        menu: true,
        purchase_requests: {
          read: true,
          create: true,
          update: true,
          delete: true,
          approval: true,
        },
        purchase_orders: {
          read: true,
          create: true,
          update: true,
          delete: true,
          approval: true,
        },
        down_payments: {
          read: true,
          create: true,
          update: true,
          delete: true,
          approval: true,
        },
        receive_orders: {
          read: true,
          create: true,
          update: true,
          delete: true,
          approval: true,
        },
        invoices: {
          read: true,
          create: true,
          update: true,
          delete: true,
          approval: true,
        },
        payment_orders: {
          read: true,
          create: true,
          update: true,
          delete: true,
          approval: true,
        },
      },
      sales: {
        menu: true,
        sales_quotations: {
          read: true,
          create: true,
          update: true,
          delete: true,
          approval: true,
        },
        sales_orders: {
          read: true,
          create: true,
          update: true,
          delete: true,
          approval: true,
        },
        down_payments: {
          read: true,
          create: true,
          update: true,
          delete: true,
          approval: true,
        },
        delivery_orders: {
          read: true,
          create: true,
          update: true,
          delete: true,
          approval: true,
        },
        delivery_notes: {
          read: true,
          create: true,
          update: true,
          delete: true,
          approval: true,
        },
        invoices: {
          read: true,
          create: true,
          update: true,
          delete: true,
          approval: true,
        },
        payment_collections: {
          read: true,
          create: true,
          update: true,
          delete: true,
          approval: true,
        },
      },
      finance: {
        menu: true,
        payment_orders: {
          read: true,
          create: true,
          update: true,
          delete: true,
          approval: true,
        },
        cash_advances: {
          read: true,
          create: true,
          update: true,
          delete: true,
          approval: true,
        },
        cash_payments: {
          read: true,
          create: true,
          update: true,
          delete: true,
          approval: true,
        },
        bank_payments: {
          read: true,
          create: true,
          update: true,
          delete: true,
          approval: true,
        },
        profit_and_loss: {
          read: true,
        },
        debts_aging_report: {
          read: true,
        },
        allocation_report: {
          read: true,
        },
      },
      manufacture: {
        menu: true,
        machines: {
          read: true,
          create: true,
          update: true,
          delete: true,
          approval: true,
        },
        processes: {
          read: true,
          create: true,
          update: true,
          delete: true,
          approval: true,
        },
        formulas: {
          read: true,
          create: true,
          update: true,
          delete: true,
          approval: true,
        },
        processing: {
          read: true,
          create: true,
          update: true,
          delete: true,
          approval: true,
        },
      },
      inventory: {
        menu: true,
        inventory_usages: {
          read: true,
          create: true,
          update: true,
          delete: true,
          approval: true,
        },
        inventory_audits: {
          read: true,
          create: true,
          update: true,
          delete: true,
          approval: true,
        },
        stock_corrections: {
          read: true,
          create: true,
          update: true,
          delete: true,
          approval: true,
        },
        transfer_items: {
          read: true,
          create: true,
          update: true,
          delete: true,
          approval: true,
        },
        receive_items: {
          read: true,
          create: true,
          update: true,
          delete: true,
          approval: true,
        },
        inventory_report: {
          read: true,
        },
      },
      accounting: {
        menu: true,
        cut_offs: {
          read: true,
          create: true,
          update: true,
          delete: true,
          approval: true,
        },
        memo_journals: {
          read: true,
          create: true,
          update: true,
          delete: true,
          approval: true,
        },
        general_ledger: {
          read: true,
        },
        subledger: {
          read: true,
        },
        balance_sheet: {
          read: true,
        },
        trial_balance: {
          read: true,
        },
      },
    },
  },
]
