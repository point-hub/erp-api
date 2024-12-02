import { IAuthReference } from '@/modules/master/users/interface'

export type TypeApprovalStatus = 'pending' | 'approved' | 'rejected'

export interface IBranchReference {
  _id?: string
  label?: string
}

export interface IWarehouseReference {
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

export interface IReference {
  ref_id: string
  ref_name: string
  ref_number: string
  ref_date: Date
  details: {
    uuid: string
    quantity: number
  }[]
}

export interface IDetail {
  uuid: string
  item?: IItemReference
  quantity_order?: number
  quantity?: number
}

export interface IFormReference {
  form_date: Date
  form_number: string
}

export interface IPurchaseOrder {
  _id: string
  label: string
}
export interface ISupplier {
  _id: string
  label: string
  code: string
  name: string
}

export interface IReceiveOrderEntity {
  _id?: string
  purchase_order?: IPurchaseOrder
  required_date?: Date
  supplier?: ISupplier
  branch?: IBranchReference
  warehouse?: IWarehouseReference
  details?: IDetail[]
  notes?: string
  driver?: string
  license_plate?: string
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
  references?: IFormReference[]
}
