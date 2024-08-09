export interface IChartOfAccountTypeEntity {
  _id?: string
  code?: string
  name?: string
  created_date?: Date
  updated_date?: Date
}

export interface IChartOfAccountCategoryEntity {
  _id?: string
  type_id?: string
  code?: string
  name?: string
  created_date?: Date
  updated_date?: Date
}

export interface IChartOfAccountEntity {
  _id?: string
  category_id?: string
  number?: string
  name?: string
  increasing_in?: string
  subledger?: string
  created_by?: string
  updated_by?: string
  created_date?: Date
  updated_date?: Date
}
