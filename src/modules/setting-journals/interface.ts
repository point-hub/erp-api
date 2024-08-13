export interface ISettingJournalEntity {
  _id?: string
  name?: string
  journals?: {
    chart_of_account_id: string
    description: string
    position: 'debit' | 'credit'
  }[]
  created_by?: string
  updated_by?: string
  created_date?: Date
  updated_date?: Date
}
