export interface IItemEntity {
  _id?: string
  category?: {
    _id?: string
    label?: string
    code?: string
    name?: string
  }
  code?: string
  name?: string
  label?: string
  unit?: string
  notes?: string
  // chart of account
  chart_of_account?: {
    _id?: string
    label?: string
    number?: string
    name?: string
  }
  // dna
  have_production_number?: boolean
  have_an_expiry_date?: boolean
  // meta
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
