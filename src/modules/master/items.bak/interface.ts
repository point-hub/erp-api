export interface IItemEntity {
  _id?: string
  category_id?: string
  chart_of_account_id?: string
  code?: string
  name?: string
  unit?: string
  have_production_number?: boolean
  have_an_expiry_date?: boolean
  created_by?: string
  updated_by?: string
  created_date?: Date
  updated_date?: Date
}
