import { type IDatabase } from '@point-hub/papi'

import { RetrieveAllChartOfAccountRepository } from '@/modules/master/chart-of-accounts/repositories/retrieve-all.repository'
import { CreateSettingJournalRepository } from '@/modules/master/setting-journals/repositories/create.repository'
import { toTitleCase } from '@/utils/titlecase'

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
      journal.account = toTitleCase(journal.account)
      journal.subledger = toTitleCase(journal.subledger)
      journal.position = toTitleCase(journal.position) as 'Debit' | 'Credit'
      if (journal.editable) {
        const account = await retrieveAllChartOfAccountRepository.handle({ filter: { name: journal.account } }, options)
        if (account?.data?.length) {
          journal.chart_of_account_id = account.data[0]._id
        }
      }
    }
    feature.module = toTitleCase(feature.module)
    feature.feature = toTitleCase(feature.feature)
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
        position: 'Debit',
        editable: true,
      },
      {
        description: 'akun cash atau bank tergantung metode pembayaran yang dipakai',
        account: 'cash / bank ',
        position: 'Credit',
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
        position: 'Credit',
        subledger: 'supplier',
        editable: true,
      },
      {
        account: 'income tax receivable',
        description: 'jumlah PPN yang dibayarkan kepada supplier',
        position: 'Debit',
        editable: true,
      },
      {
        account: 'payment difference',
        description: 'pendapatan (beban) selisih pembayaran',
        position: 'Debit',
        editable: true,
      },
      {
        account: 'inventory',
        description: 'akun sediaan tergantung dari coa yang ada di master item',
        position: 'Debit',
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
        position: 'Credit',
        subledger: 'customer',
        editable: true,
      },
      {
        account: 'cash / bank',
        description: 'diambil dari modul cash atau bank',
        position: 'Debit',
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
        position: 'Debit',
        editable: true,
      },
      {
        account: 'inventory',
        description: 'diambil dari master item yang dikeluarkan pada delivery note',
        position: 'Credit',
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
        position: 'Debit',
        subledger: 'customer',
        editable: true,
      },
      {
        account: 'income tax payable',
        description: 'jumlah PPN yang diterima dari customer',
        position: 'Credit',
        editable: true,
      },
      {
        account: 'inventory',
        description: 'akun sediaan tergantung dari coa yang ada di master item',
        position: 'Credit',
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
        position: 'Debit',
        editable: true,
      },
      {
        account: 'inventory',
        description:
          'diambil dari master item yang dikeluarkan pada stock correction,jika ada penambahan jumlah stock maka posisi dibalik',
        position: 'Credit',
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
        position: 'Debit',
        subledger: 'item',
        editable: true,
      },
      {
        account: 'inventory',
        description: 'diambil dari master item yang dalam proses pengiriman',
        position: 'Credit',
        subledger: 'item',
      },
      {
        account: 'difference stock expense',
        description: 'jumlah selisih item yang belum diterima',
        position: 'Debit',
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
        position: 'Credit',
        subledger: 'item',
      },
      {
        account: 'inventory in distribution',
        description: 'jumlah item yang dalam proses pengiriman',
        position: 'Debit',
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
        description: 'jumlah nominal account yang dicut off,posisinya bisa credit or Debit',
        position: 'Debit',
        editable: true,
      },
    ],
  },
  {
    module: 'manufacture',
    feature: 'processing in',
    journals: [
      {
        account: 'work in process inventory',
        description: 'jumlah inventory yang dalam proses produksi',
        position: 'Debit',
        subledger: 'item',
        editable: true,
      },
      {
        account: 'raw material inventory',
        description:
          'jumlah bahan baku yang dipakai untuk proses produksi,diambil dari account yang digunakan pada item',
        position: 'Credit',
        subledger: 'item',
      },
    ],
  },
  {
    module: 'manufacture',
    feature: 'processing out',
    journals: [
      {
        account: 'finished good inventory',
        description: 'jumlah item hasil produksi, diambil dari account yang ada diitem ',
        position: 'Debit',
        subledger: 'item',
      },
      {
        account: 'work in process inventory',
        description: 'jumlah inventory yang dalam proses produksi',
        position: 'Credit',
        subledger: 'item',
        editable: true,
      },
    ],
  },
]
