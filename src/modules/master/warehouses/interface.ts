import { IBranchReference } from '@/modules/purchasing/purchase-requests/interface'

export interface IWarehouseEntity {
  _id?: string
  branch?: IBranchReference
  code?: string
  name?: string
  label?: string
  address?: string
  phone?: string
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
