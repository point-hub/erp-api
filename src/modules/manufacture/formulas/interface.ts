export interface IFormulaEntity {
  id?: string
  code?: string
  name?: string
  finished_goods?: {
    item?: {
      _id: string
      label: string
      code: string
      name: string
      unit: string
    }
    quantity: number
  }[]
  raw_materials?: {
    item?: {
      _id: string
      label: string
      code: string
      name: string
      unit: string
    }
    quantity: number
  }[]
  process?: {
    _id: string
    label: string
    code: string
    name: string
  }
  approval_to?: {
    _id: string
    label: string
    email: string
  }
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
