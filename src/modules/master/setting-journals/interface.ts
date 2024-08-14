export interface ISettingJournalEntity {
  _id?: string
  module?: string
  feature?: string
  journals?: {
    chart_of_account_id?: string
    chart_of_account?: {
      number: string
      name: string
    }
    description?: string
    account?: string
    subledger?: string
    editable?: boolean
    position?: 'debit' | 'credit'
  }[]
  created_by?: string
  updated_by?: string
  created_date?: Date
  updated_date?: Date
}
