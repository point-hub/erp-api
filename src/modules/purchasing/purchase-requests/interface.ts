import { IAuthBy } from '@/modules/master/users/interface'

export interface IBranch {
  _id?: string
  label?: string
  code?: string
  name?: string
}

export interface IItem {
  _id?: string
  label?: string
  code?: string
  name?: string
  unit?: string
}

export interface IAllocation {
  _id?: string
  label?: string
  code?: string
  name?: string
}

export interface IDetail {
  item?: IItem
  notes?: string
  quantity?: number
  allocation?: IAllocation
}

export interface IFormReference {
  form_date: Date
  form_number: string
}

export interface IPurchaseRequestEntity {
  _id?: string
  form_number?: string
  rev?: number
  required_date?: string
  branch?: IBranch
  details?: IDetail[]
  notes?: string
  // state create
  created_by?: IAuthBy
  created_date?: Date
  // state update
  updated_by?: IAuthBy
  updated_date?: Date
  // state form approval
  request_approval_by?: IAuthBy
  request_approval_to?: IAuthBy
  request_approval_date?: Date
  approval_date?: Date
  approval_status?: 'pending' | 'approved' | 'rejected'
  // state delete form
  request_delete_by?: IAuthBy
  request_delete_to?: IAuthBy
  request_delete_date?: Date
  deleted_date?: Date
  deleted_reason?: string
  deleted_status?: 'pending' | 'approved' | 'rejected'
  // status
  form_status?: 'open' | 'done'
  form_references?: IFormReference[]
}
