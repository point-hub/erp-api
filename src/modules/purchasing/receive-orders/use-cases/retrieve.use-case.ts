import { IAuthReference } from '@/modules/master/users/interface'

import { IPurchaseOrder, ISupplier, IWarehouseReference } from '../interface'
import { IBranch, IDetails, IRetrieveReceiveOrderRepository } from '../repositories/retrieve.repository'

export interface IInput {
  _id: string
}

export interface IDeps {
  retrieveReceiveOrderRepository: IRetrieveReceiveOrderRepository
}

export interface IOutput {
  _id: string
  revised_count: number
  form_number: string
  purchase_order: IPurchaseOrder
  required_date: Date
  required_down_payment: boolean
  supplier: ISupplier
  branch: IBranch
  warehouse: IWarehouseReference
  details: IDetails[]
  notes: string
  driver: string
  license_plate: string
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
  has_invoice: boolean
}

export class RetrieveReceiveOrderUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveReceiveOrderRepository.handle(input._id)
    // 2. output
    return {
      _id: response._id,
      revised_count: response.revised_count,
      form_number: response.form_number,
      purchase_order: response.purchase_order,
      required_date: response.required_date,
      required_down_payment: response.required_down_payment,
      supplier: response.supplier,
      branch: response.branch,
      warehouse: response.warehouse,
      details: response.details,
      notes: response.notes,
      driver: response.driver,
      license_plate: response.license_plate,
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
      has_invoice: response.has_invoice,
    }
  }
}
