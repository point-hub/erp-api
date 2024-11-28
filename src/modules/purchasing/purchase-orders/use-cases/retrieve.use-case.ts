import { IAuthReference } from '@/modules/master/users/interface'

import { IPurchaseRequest, ISupplier } from '../interface'
import { IBranch, IDetails, IRetrievePurchaseOrderRepository } from '../repositories/retrieve.repository'

export interface IInput {
  _id: string
}

export interface IDeps {
  retrievePurchaseOrderRepository: IRetrievePurchaseOrderRepository
}

export interface IOutput {
  _id: string
  revised_count: number
  form_number: string
  purchase_request: IPurchaseRequest
  required_date: Date
  required_down_payment: boolean
  supplier: ISupplier
  branch: IBranch
  details: IDetails[]
  subtotal: number
  discount: number
  tax_base: number
  tax_type: string
  tax: number
  total: number
  notes: string
  approval_status: 'pending' | 'approved' | 'rejected'
  approval_to: IAuthReference
  rejected_reason: string
  created_by: IAuthReference
  updated_by: IAuthReference
  approval_date: Date
  created_date: Date
  updated_date: Date
  deleted_by: IAuthReference
  deleted_date: Date
  deleted_reason: string
  is_deleted: boolean
}

export class RetrievePurchaseOrderUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrievePurchaseOrderRepository.handle(input._id)
    // 2. output
    return {
      _id: response._id,
      revised_count: response.revised_count,
      form_number: response.form_number,
      purchase_request: response.purchase_request,
      required_date: response.required_date,
      required_down_payment: response.required_down_payment,
      supplier: response.supplier,
      branch: response.branch,
      details: response.details,
      subtotal: response.subtotal,
      discount: response.discount,
      tax_base: response.tax_base,
      tax_type: response.tax_type,
      tax: response.tax,
      total: response.total,
      notes: response.notes,
      approval_status: response.approval_status,
      approval_to: response.approval_to,
      rejected_reason: response.rejected_reason,
      created_by: response.created_by,
      updated_by: response.updated_by,
      approval_date: response.approval_date,
      created_date: response.created_date,
      updated_date: response.updated_date,
      deleted_by: response.deleted_by,
      deleted_date: response.deleted_date,
      deleted_reason: response.deleted_reason,
      is_deleted: response.is_deleted,
    }
  }
}
