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
      users: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      roles: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      branchs: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      warehouses: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      allocations: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      suppliers: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      customers: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      items: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      chart_of_accounts: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      setting_journals: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
    },
    purchasing: {
      menu: false,
      purchase_requests: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      purchase_orders: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      down_payments: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      purchase_receives: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      invoices: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      payment_orders: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
    },
    sales: {
      menu: false,
      sales_quotations: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      sales_orders: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      down_payments: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      delivery_orders: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      delivery_notes: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      invoices: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      payment_collections: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
    },
    finance: {
      menu: false,
      payment_orders: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      cash_advances: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      cash_payments: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      bank_payments: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      profit_and_loss: {
        read: false,
      },
      debts_aging_report: {
        read: true,
      },
      allocation_report: {
        read: true,
      },
    },
    manufacture: {
      menu: false,
      machines: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      processes: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      formulas: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      processing: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
    },
    inventory: {
      menu: false,
      inventory_usages: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      inventory_audits: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      stock_corrections: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      transfer_items: {
        read: true,
        create: true,
        update: true,
        delete: true,
      },
      receive_items: {
        read: true,
        create: true,
        update: true,
        delete: true,
      },
      inventory_report: {
        read: false,
      },
    },
    accounting: {
      menu: false,
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
]
