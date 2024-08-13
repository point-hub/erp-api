import { type IDatabase } from '@point-hub/papi'

import { CreateSettingJournalRepository } from '@/modules/setting-journals/repositories/create.repository'

export const seed = async (dbConnection: IDatabase, options: unknown) => {
  console.info(`[seed] setting journals data`)
  // delete all data inside collection
  await dbConnection.collection('setting-journals').deleteAll(options)
  // prepare repository
  const createSettingJournalRepository = new CreateSettingJournalRepository(dbConnection)
  // seed
  await createSettingJournalRepository.handle(seeds[0], options)
}

export const seeds = [
  {
    module: 'purchasing',
    feature: 'down payment',
    journals: [
      {
        account: 'purchase down payment',
        description: 'jumlah dp yang harus dibayarkan ke supplier',
        position: 'debit',
        subledger: 'supplier',
      },
      {
        account: 'Cash or Bank ',
        description: 'diambil dari modul cash atau bank',
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
      },
      {
        account: 'income tax receivable',
        description: 'jumlah PPN yang dibayarkan kepada supplier',
        position: 'debit',
      },
      {
        account: 'payment difference',
        description: 'pendapata / beban selisih pembayaran',
        position: 'debit',
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
    module: 'purchasing',
    feature: 'payment order',
    journals: [
      {
        account: 'account payable',
        description: 'diambil dari modul purchase invoice',
        position: 'debit',
        subledger: 'supplier',
      },
      {
        account: 'purchase down payment',
        description: 'diambil dari modul purchase down payment',
        position: 'credit',
        subledger: 'supplier',
      },
      {
        account: 'Others',
        description: 'Diambil dari account yang dipilih pada saat pembuatan form payment order',
        position: 'credit',
      },
      {
        account: 'Cash or bank',
        description: 'Diambil dari modul cash atau bank',
        position: 'debit',
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
      },
      {
        account: 'Cash or bank',
        description: 'Diambil dari modul cash atau bank',
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
      },
      {
        account: 'Inventory',
        description: 'Diambil dari master item yang dikeluarkan pada delivery note',
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
      },
      {
        account: 'income tax payable',
        description: 'jumlah PPN yang diterima dari customer',
        position: 'credit',
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
      },
      {
        account: 'Inventory',
        description:
          'Diambil dari master item yang dikeluarkan pada stock correction,jika ada penambahan jumlah stock maka posisi dibalik',
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
        description: 'jumlah item yang dalam proses pengiriman,Jika ada item yang selisih maka dibalik secara posisi',
        position: 'debit',
        subledger: 'item',
      },
      {
        account: 'Inventory',
        description: 'Diambil dari master item yang dalam proses pengiriman',
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
        account: 'Inventory',
        description: 'Diambil dari master item yang dalam proses pengiriman',
        position: 'credit',
        subledger: 'item',
      },
      {
        account: 'inventory in distribution',
        description: 'jumlah item yang dalam proses pengiriman',
        position: 'debit',
        subledger: 'item',
      },
    ],
  },
  {
    module: 'accounting',
    feature: 'Cut Off',
    journals: [
      {
        account: 'Account yang dipilih',
        description:
          'Diambil dari master account yang dipilih pada saat create cut off,posisi account dan status subledger mengikuti coa yang dipilih ',
        position: 'debit or credit',
      },
      {
        account: 'retained earning',
        description: 'jumlah nominal account yang dicut off,posisinya bisa credit or debit',
        position: 'debit or credit',
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
      },
    ],
  },
]
