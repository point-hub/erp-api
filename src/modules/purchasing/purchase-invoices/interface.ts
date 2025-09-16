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
  receive_order: {
    _id: string
  }
  uuid: string
  item?: IItemReference
  quantity?: number
  price?: number
  discount?: number
  total?: number
  allocation?: IAllocationReference
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

export interface IPurchaseInvoiceEntity {
  _id?: string
  purchase_order?: IPurchaseOrder
  due_date?: Date
  required_date?: Date
  required_down_payment?: boolean
  supplier?: ISupplier
  branch?: IBranchReference
  details?: IDetail[]
  subtotal?: number
  discount_type?: string
  discount?: number
  tax_base?: number
  tax_type?: string
  tax?: number
  expedition_fee?: number
  total?: number
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
  references?: IFormReference[]
}
