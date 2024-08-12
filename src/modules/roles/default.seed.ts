import { type IDatabase } from '@point-hub/papi'

import { CreateRoleRepository } from '@/modules/roles/repositories/create.repository'

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
    code: 'RL0001',
    name: 'Super Admin',
    permission: {
      master: {
        menu: true,
        users: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        roles: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        branchs: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        warehouses: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        allocations: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        suppliers: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        customers: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        items: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        chart_of_accounts: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        setting_journals: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
      },
      purchasing: {
        menu: true,
        purchase_requests: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        purchase_orders: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        down_payments: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        receive_orders: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        invoices: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        payment_orders: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
      },
      sales: {
        menu: true,
        sales_quotations: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        sales_orders: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        down_payments: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        delivery_orders: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        delivery_notes: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        invoices: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        payment_collections: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
      },
      finance: {
        menu: true,
        payment_orders: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        cash_advances: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        cash_payments: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        bank_payments: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        profit_and_loss: {
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
        },
        processes: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        formulas: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        processing: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
      },
      inventory: {
        menu: true,
        inventory_usages: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        inventory_audits: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        stock_corrections: {
          read: true,
          create: true,
          update: true,
          delete: true,
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
        },
        memo_journals: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        general_ledger: {
          read: true,
        },
        sub_ledger: {
          read: true,
        },
        balance_sheet: {
          read: true,
        },
      },
    },
  },
]
