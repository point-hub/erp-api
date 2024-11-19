export interface IChartOfAccountType {
  _id?: string
  name?: string
}

export interface IChartOfAccountCategory {
  _id?: string
  name?: string
}

export interface IChartOfAccountEntity {
  _id?: string
  type_id?: string
  category_id?: string
  number?: string
  name?: string
  subledger?: string
  notes?: string
  created_by?: {
        _id?: string,
        label?: string,
        email?: string,
      },
  updated_by?: {
        _id?: string,
        label?: string,
        email?: string,
      },
  created_date?: Date
  updated_date?: Date
}
