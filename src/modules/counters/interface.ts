export interface ICounterEntity {
  _id?: string
  code?: string
  name?: string
  count?: number
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
