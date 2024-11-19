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
    category?: string
    type?: string
    value?: number
    position?: 'debit' | 'credit'
  }[]
  created_by?: {
    _id?: string
    label?: string
    email?: string
  }
  updated_by?: {
    _id?: string
    label?: string
    email?: string
  }
  created_date?: Date
  updated_date?: Date
}
