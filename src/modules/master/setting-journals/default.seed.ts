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
        const account = await retrieveAllChartOfAccountRepository.handle(
          {
            filter: {
              name: journal.account,
            },
          },
          options,
        )
        if (account?.data?.length) {
          console.log(account.data)
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
        description: 'jumlah uang muka yang harus dibayarkan ke supplier',
        account: 'purchase down payment',
        subledger: 'supplier',
        position: 'debit',
        editable: true,
      },
      {
        description: 'akun cash atau bank tergantung metode pembayaran yang dipakai',
        account: 'cash / bank ',
        position: 'credit',
      },
    ],
  },
  {
    module: 'purchasing',
    feature: 'purchase invoice',
    journals: [
      {
        account: 'account payable',
        description: 'jumlah hutang yang harus dibayarkan ke supplier',
        position: 'credit',
        subledger: 'supplier',
        editable: true,
      },
      {
        account: 'income tax receivable',
        description: 'jumlah PPN yang dibayarkan kepada supplier',
        position: 'debit',
        editable: true,
      },
      {
        account: 'payment difference',
        description: 'pendapatan (beban) selisih pembayaran',
        position: 'debit',
        editable: true,
      },
      {
        account: 'inventory',
        description: 'akun sediaan tergantung dari coa yang ada di master item',
        position: 'debit',
        subledger: 'item',
      },
    ],
  },
  {
    module: 'sales',
    feature: 'down payment',
    journals: [
      {
        account: 'sales down payment',
        description: 'jumlah uang muka yang diterima dari customer ',
        position: 'credit',
        subledger: 'customer',
        editable: true,
      },
      {
        account: 'cash / bank',
        description: 'diambil dari modul cash atau bank',
        position: 'debit',
      },
    ],
  },
  {
    module: 'sales',
    feature: 'delivery notes',
    journals: [
      {
        account: 'cost of sales',
        description: 'jumlah rupiah barang yang dikeluarkan ',
        position: 'debit',
        editable: true,
      },
      {
        account: 'inventory',
        description: 'diambil dari master item yang dikeluarkan pada delivery note',
        position: 'credit',
        subledger: 'item',
      },
    ],
  },
  {
    module: 'sales',
    feature: 'sales invoice',
    journals: [
      {
        account: 'account receivable',
        description: 'jumlah Piutang yang harus diterima dari supplier',
        position: 'debit',
        subledger: 'customer',
        editable: true,
      },
      {
        account: 'income tax payable',
        description: 'jumlah PPN yang diterima dari customer',
        position: 'credit',
        editable: true,
      },
      {
        account: 'inventory',
        description: 'akun sediaan tergantung dari coa yang ada di master item',
        position: 'credit',
        subledger: 'item',
      },
    ],
  },
  {
    module: 'inventory',
    feature: 'stock correction',
    journals: [
      {
        account: 'difference stock expense',
        description:
          'jumlah rupiah barang yang selisih ketika ada pengurangan stock, jika ada penambahan jumlah stock maka posisi dibalik',
        position: 'debit',
        editable: true,
      },
      {
        account: 'inventory',
        description:
          'diambil dari master item yang dikeluarkan pada stock correction,jika ada penambahan jumlah stock maka posisi dibalik',
        position: 'credit',
        subledger: 'item',
      },
    ],
  },
  {
    module: 'inventory',
    feature: 'transfer item',
    journals: [
      {
        account: 'inventory in distribution',
        description: 'jumlah item yang dalam proses pengiriman, jika ada item yang selisih maka dibalik secara posisi',
        position: 'debit',
        subledger: 'item',
        editable: true,
      },
      {
        account: 'inventory',
        description: 'diambil dari master item yang dalam proses pengiriman',
        position: 'credit',
        subledger: 'item',
      },
      {
        account: 'difference stock expense',
        description: 'jumlah selisih item yang belum diterima',
        position: 'debit',
      },
    ],
  },
  {
    module: 'inventory',
    feature: 'receive item',
    journals: [
      {
        account: 'inventory',
        description: 'diambil dari master item yang dalam proses pengiriman',
        position: 'credit',
        subledger: 'item',
      },
      {
        account: 'inventory in distribution',
        description: 'jumlah item yang dalam proses pengiriman',
        position: 'debit',
        subledger: 'item',
        editable: true,
      },
    ],
  },
  {
    module: 'accounting',
    feature: 'cut off',
    journals: [
      {
        account: 'retained earning',
        description: 'jumlah nominal account yang dicut off,posisinya bisa credit or debit',
        position: 'debit',
        editable: true,
      },
    ],
  },
  {
    module: 'manufacture',
    feature: 'processing-in',
    journals: [
      {
        account: 'work in process inventory',
        description: 'jumlah inventory yang dalam proses produksi',
        position: 'debit',
        subledger: 'item',
        editable: true,
      },
      {
        account: 'raw material inventory',
        description:
          'jumlah bahan baku yang dipakai untuk proses produksi,diambil dari account yang digunakan pada item',
        position: 'credit',
        subledger: 'item',
      },
    ],
  },
  {
    module: 'manufacture',
    feature: 'processing-out',
    journals: [
      {
        account: 'finished good inventory',
        description: 'jumlah item hasil produksi, diambil dari account yang ada diitem ',
        position: 'debit',
        subledger: 'item',
      },
      {
        account: 'work in process inventory',
        description: 'jumlah inventory yang dalam proses produksi',
        position: 'credit',
        subledger: 'item',
        editable: true,
      },
    ],
  },
]
