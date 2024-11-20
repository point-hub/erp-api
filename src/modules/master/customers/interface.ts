export interface ICustomerEntity {
  _id?: string
  customer_group?: {
    _id?: string
    label?: string
    code?: string
    name?: string
  }
  code?: string
  name?: string
  address?: string
  phone?: string
  email?: string
  notes?: string
  // bank info
  bank_name?: string
  bank_branch?: string
  bank_account_name?: string
  bank_account_number?: string
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
