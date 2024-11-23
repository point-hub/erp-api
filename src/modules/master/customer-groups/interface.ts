export interface ICustomerGroupEntity {
  _id?: string
  code?: string
  name?: string
  label?: string
  notes?: string
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
