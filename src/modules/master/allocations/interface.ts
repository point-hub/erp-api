export interface IAllocationEntity {
  _id?: string
  allocation_group?: {
    _id: string
    label: string
    code: string
  }
  code?: string
  name?: string
  label?: string
  notes?: string
  created_by?: string
  updated_by?: string
  created_date?: Date
  updated_date?: Date
}
