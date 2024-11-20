import { IAuthReference } from '@/modules/master/users/interface'

export type TypeApprovalStatus = 'pending' | 'approved' | 'rejected'

export interface IBranchReference {
  _id?: string
  label?: string
}

export interface IAllocationReference {
  _id?: string
  label?: string
}

export interface IItemReference {
  _id?: string
  label?: string
  unit?: string
}

export interface IDetail {
  uuid: string
  item?: IItemReference
  notes?: string
  quantity?: number
  allocation?: IAllocationReference
}

export interface IFormReference {
  form_date: Date
  form_number: string
}

export interface IPurchaseRequestEntity {
  _id?: string
  required_date?: Date
  branch?: IBranchReference
  details?: IDetail[]
  notes?: string
  // state create
  created_by?: IAuthReference
  created_date?: Date
  // state update
  updated_by?: IAuthReference
  updated_date?: Date
  // state form approval
  approval_request_by?: IAuthReference
  approval_request_date?: Date
  approval_to?: IAuthReference
  approval_date?: Date
  approval_status?: TypeApprovalStatus
  rejected_reason?: string
  // state delete form
  deleted_by?: IAuthReference
  deleted_date?: Date
  deleted_reason?: string
  is_deleted?: boolean
  // state of form
  form_date?: string
  form_number?: string
  revised_count?: number
  is_revised?: boolean
  is_finished?: boolean
  form_references?: IFormReference[]
}
