import { IAuthBy } from '@/modules/master/users/interface'

export interface IBranch {
  _id?: string
  _ref?: string
  label?: string
  code?: string
  name?: string
}

export interface IItem {
  _id?: string
  _ref?: string
  label?: string
  code?: string
  name?: string
  unit?: string
}

export interface IAllocation {
  _id?: string
  _ref?: string
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

export interface ISalesQuotationEntity {
  _id?: string
  form_date?: string
  form_number?: string
  revised_count?: number
  is_revised?: boolean
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
  // state form request approval
  request_approval_by?: IAuthBy
  request_approval_to?: IAuthBy
  request_approval_date?: Date
  request_approval_status?: 'pending' | 'approved' | 'rejected'
  // state form approval
  approval_date?: Date
  approval_reason?: string
  approval_to?: IAuthBy
  is_approved?: boolean
  // state request delete form
  request_delete_by?: IAuthBy
  request_delete_to?: IAuthBy
  request_delete_date?: Date
  request_delete_status?: 'pending' | 'approved' | 'rejected'
  // state delete form
  deleted_date?: Date
  deleted_reason?: string
  deleted_by?: IAuthBy
  is_deleted?: boolean
  // status
  form_status?: 'open' | 'done'
  form_references?: IFormReference[]
}
