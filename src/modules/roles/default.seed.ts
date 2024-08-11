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
        user: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        role: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        branch: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        warehouse: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        allocation: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        supplier: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        customer: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        item: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        chart_of_account: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        setting_journal: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
      },
      purchasing: {
        menu: true,
        purchase_request: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        purchase_order: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        down_payment: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        purchase_receive: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        invoice: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        payment_order: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
      },
      sales: {
        menu: true,
        sales_quotation: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        sales_order: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        down_payment: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        delivery_order: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        delivery_note: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        invoice: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        payment_collection: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
      },
      finance: {
        menu: true,
        payment_order: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        cash_advance: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        cash: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        bank: {
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
        machine: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        process: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        formula: {
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
        inventory_usage: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        inventory_audit: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        stock_correction: {
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
        cut_off: {
          read: true,
          create: true,
          update: true,
          delete: true,
        },
        memo_journal: {
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
