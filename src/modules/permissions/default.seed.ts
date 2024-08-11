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
      user: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      role: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      branch: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      warehouse: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      allocation: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      supplier: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      customer: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      item: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      chart_of_account: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      setting_journal: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
    },
    purchasing: {
      menu: false,
      purchase_request: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      purchase_order: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      down_payment: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      purchase_receive: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      invoice: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      payment_order: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
    },
    sales: {
      menu: false,
      sales_quotation: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      sales_order: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      down_payment: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      delivery_order: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      delivery_note: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      invoice: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      payment_collection: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
    },
    finace: {
      menu: false,
      payment_order: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      cash_advance: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      cash: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      bank: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      profit_and_loss: {
        read: false,
      },
    },
    manufacture: {
      menu: false,
      machine: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      process: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      formula: {
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
      inventory_usage: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      inventory_audit: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      stock_correction: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      inventory_report: {
        read: false,
      },
    },
    accounting: {
      menu: false,
      cut_off: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      memo_journal: {
        read: false,
        create: false,
        update: false,
        delete: false,
      },
      general_ledger: {
        read: false,
      },
      sub_ledger: {
        read: false,
      },
      balance_sheet: {
        read: false,
      },
    },
  },
]
