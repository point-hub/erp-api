export interface IPurchaseRequestEntity {
  _id?: string
  form_number: string
  rev: number
  branch?: {
    _id?: string
    label?: string
    code?: string
    name?: string
  }
  items?: {
    item?: {
      _id?: string
      label?: string
      code?: string
      name?: string
      unit?: string
    }
    notes?: string
    quantity?: number
    allocation?: {
      _id?: string
      label?: string
      code?: string
      name?: string
    }
  }
  notes?: string
  approval_to?: {
    _id?: string
    label?: string
    name?: string
    username?: string
    email?: string
  }
  created_by?: {
    _id?: string
    label?: string
    name?: string
    username?: string
    email?: string
  }
  updated_by?: {
    _id?: string
    label?: string
    name?: string
    username?: string
    email?: string
  }
  created_date?: Date
  updated_date?: Date
  required_date?: Date
}
