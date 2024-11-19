export interface IRoleEntity {
  _id?: string
  code?: string
  name?: string
  notes?: string
  permission?: { [key: string]: boolean | { [key: string]: boolean } }
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
