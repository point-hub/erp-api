import { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import { IAuth, IAuthReference } from '@/modules/master/users/interface'

import { IUpdatePurchaseOrderReference } from '../../purchase-orders/utils/update-reference'
import { DownPaymentEntity } from '../entity'
import { IBranchReference, IDetail, IPurchaseOrder, ISupplier, TypeApprovalStatus } from '../interface'
import { ICreateDownPaymentRepository } from '../repositories/create.repository'
import { IUpdateDownPaymentRepository } from '../repositories/update.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  _id: string
  auth: IAuth
  data: {
    required_date: Date
    required_down_payment: boolean
    revised_count: number
    form_number: string
    purchase_order: IPurchaseOrder
    supplier: ISupplier
    branch: IBranchReference
    details: IDetail[]
    subtotal: number
    discount: number
    tax_base: number
    tax_type: string
    tax: number
    total: number
    payment_type: 'cash' | 'bank'
    amount: number
    notes?: string
    approval_to: IAuthReference
    approval_status: TypeApprovalStatus
    created_date?: Date
  }
}

export interface IDeps {
  objClean: IObjClean
  schemaValidation: ISchemaValidation
  createDownPaymentRepository: ICreateDownPaymentRepository
  updateDownPaymentRepository: IUpdateDownPaymentRepository
  updatePurchaseOrderReference: IUpdatePurchaseOrderReference
}

export interface IOutput {
  inserted_id: string
}
export class UpdateDownPaymentUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input.data, createValidation)
    // 3. define entity
    const downPaymentEntity = new DownPaymentEntity({
      revised_count: input.data.revised_count,
      form_number: input.data.form_number,
      purchase_order: {
        _id: input.data.purchase_order._id,
        label: input.data.purchase_order.label,
      },
      supplier: {
        _id: input.data.supplier._id,
        label: input.data.supplier.label,
        code: input.data.supplier.code,
        name: input.data.supplier.name,
      },
      required_date: input.data.required_date,
      required_down_payment: input.data.required_down_payment,
      branch: input.data.branch,
      details: input.data.details,
      subtotal: input.data.subtotal,
      discount: input.data.discount,
      tax_base: input.data.tax_base,
      tax_type: input.data.tax_type,
      tax: input.data.tax,
      total: input.data.total,
      payment_type: input.data.payment_type,
      amount: input.data.amount,
      notes: input.data.notes,
      is_revised: false,
      is_finished: false,
      approval_request_by: {
        _id: input.auth._id,
        label: input.auth.name,
        email: input.auth.email,
      },
      approval_request_date: new Date(),
      approval_to: input.data.approval_to,
      approval_status: 'pending',
      created_by: {
        _id: input.auth._id,
        label: input.auth.name,
        email: input.auth.email,
      },
      created_date: new Date(),
    })
    downPaymentEntity.data = deps.objClean(downPaymentEntity.data)

    // 4. database operation
    const response = await deps.createDownPaymentRepository.handle(downPaymentEntity.data)

    const details = downPaymentEntity.data.details?.map((el) => ({
      uuid: el.uuid as string,
      quantity: el.quantity as number,
    }))

    const reference = {
      ref_id: response.inserted_id,
      ref_name: 'down_payments',
      ref_number: 'xx',
      ref_date: downPaymentEntity.data.created_date as Date,
      details: details ?? [],
    }
    await deps.updatePurchaseOrderReference.delete(input.data.purchase_order._id, 'down_payments', input._id)
    await deps.updatePurchaseOrderReference.add(input.data.purchase_order, reference)
    await deps.updateDownPaymentRepository.handle(input._id, {
      is_revised: true,
    })
    // 5. output
    return { inserted_id: response.inserted_id }
  }
}
