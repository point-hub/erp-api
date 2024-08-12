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
        approval: false,
      },
      roles: {
        read: false,
        create: false,
        update: false,
        delete: false,
        approval: false,
      },
      branches: {
        read: false,
        create: false,
        update: false,
        delete: false,
        approval: false,
      },
      warehouses: {
        read: false,
        create: false,
        update: false,
        delete: false,
        approval: false,
      },
      allocations: {
        read: false,
        create: false,
        update: false,
        delete: false,
        approval: false,
      },
      suppliers: {
        read: false,
        create: false,
        update: false,
        delete: false,
        approval: false,
      },
      customers: {
        read: false,
        create: false,
        update: false,
        delete: false,
        approval: false,
      },
      items: {
        read: false,
        create: false,
        update: false,
        delete: false,
        approval: false,
      },
      chart_of_accounts: {
        read: false,
        create: false,
        update: false,
        delete: false,
        approval: false,
      },
      setting_journals: {
        read: false,
        create: false,
        update: false,
        delete: false,
        approval: false,
      },
    },
    purchasing: {
      menu: false,
      purchase_requests: {
        read: false,
        create: false,
        update: false,
        delete: false,
        approval: false,
      },
      purchase_orders: {
        read: false,
        create: false,
        update: false,
        delete: false,
        approval: false,
      },
      down_payments: {
        read: false,
        create: false,
        update: false,
        delete: false,
        approval: false,
      },
      purchase_receives: {
        read: false,
        create: false,
        update: false,
        delete: false,
        approval: false,
      },
      invoices: {
        read: false,
        create: false,
        update: false,
        delete: false,
        approval: false,
      },
      payment_orders: {
        read: false,
        create: false,
        update: false,
        delete: false,
        approval: false,
      },
    },
    sales: {
      menu: false,
      sales_quotations: {
        read: false,
        create: false,
        update: false,
        delete: false,
        approval: false,
      },
      sales_orders: {
        read: false,
        create: false,
        update: false,
        delete: false,
        approval: false,
      },
      down_payments: {
        read: false,
        create: false,
        update: false,
        delete: false,
        approval: false,
      },
      delivery_orders: {
        read: false,
        create: false,
        update: false,
        delete: false,
        approval: false,
      },
      delivery_notes: {
        read: false,
        create: false,
        update: false,
        delete: false,
        approval: false,
      },
      invoices: {
        read: false,
        create: false,
        update: false,
        delete: false,
        approval: false,
      },
      payment_collections: {
        read: false,
        create: false,
        update: false,
        delete: false,
        approval: false,
      },
    },
    finance: {
      menu: false,
      payment_orders: {
        read: false,
        create: false,
        update: false,
        delete: false,
        approval: false,
      },
      cash_advances: {
        read: false,
        create: false,
        update: false,
        delete: false,
        approval: false,
      },
      cash_payments: {
        read: false,
        create: false,
        update: false,
        delete: false,
        approval: false,
      },
      bank_payments: {
        read: false,
        create: false,
        update: false,
        delete: false,
        approval: false,
      },
      profit_and_loss: {
        read: false,
      },
      debts_aging_report: {
        read: false,
      },
      allocation_report: {
        read: false,
      },
    },
    manufacture: {
      menu: false,
      machines: {
        read: false,
        create: false,
        update: false,
        delete: false,
        approval: false,
      },
      processes: {
        read: false,
        create: false,
        update: false,
        delete: false,
        approval: false,
      },
      formulas: {
        read: false,
        create: false,
        update: false,
        delete: false,
        approval: false,
      },
      processing: {
        read: false,
        create: false,
        update: false,
        delete: false,
        approval: false,
      },
    },
    inventory: {
      menu: false,
      inventory_usages: {
        read: false,
        create: false,
        update: false,
        delete: false,
        approval: false,
      },
      inventory_audits: {
        read: false,
        create: false,
        update: false,
        delete: false,
        approval: false,
      },
      stock_corrections: {
        read: false,
        create: false,
        update: false,
        delete: false,
        approval: false,
      },
      transfer_items: {
        read: false,
        create: false,
        update: false,
        delete: false,
        approval: false,
      },
      receive_items: {
        read: false,
        create: false,
        update: false,
        delete: false,
        approval: false,
      },
      inventory_report: {
        read: false,
      },
    },
    accounting: {
      menu: false,
      cut_offs: {
        read: false,
        create: false,
        update: false,
        delete: false,
        approval: false,
      },
      memo_journals: {
        read: false,
        create: false,
        update: false,
        delete: false,
        approval: false,
      },
      general_ledger: {
        read: false,
      },
      subledger: {
        read: false,
      },
      balance_sheet: {
        read: false,
      },
      trial_balance: {
        read: false,
      },
    },
  },
]
