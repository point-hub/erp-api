import { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import { IAuth, IAuthReference } from '@/modules/master/users/interface'

import { IUpdatePurchaseOrderInvoice } from '../../purchase-orders/utils/update-invoice'
import { PurchaseInvoiceEntity } from '../entity'
import { IBranchReference, IDetail, IPurchaseOrder, ISupplier, TypeApprovalStatus } from '../interface'
import { ICreatePurchaseInvoiceRepository } from '../repositories/create.repository'
import { IUpdatePurchaseInvoiceRepository } from '../repositories/update.repository'
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
    notes?: string
    approval_to: IAuthReference
    approval_status: TypeApprovalStatus
    created_date?: Date
  }
}

export interface IDeps {
  objClean: IObjClean
  schemaValidation: ISchemaValidation
  createPurchaseInvoiceRepository: ICreatePurchaseInvoiceRepository
  updatePurchaseInvoiceRepository: IUpdatePurchaseInvoiceRepository
  updatePurchaseOrderInvoice: IUpdatePurchaseOrderInvoice
  tokenGenerate(): string
}

export interface IOutput {
  inserted_id: string
}
export class UpdatePurchaseInvoiceUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input.data, createValidation)
    // 3. define entity

    input.data.details = input.data.details.map((obj) => {
      return {
        ...obj,
        quantity_pending: obj.quantity,
      }
    })

    const purchaseInvoiceEntity = new PurchaseInvoiceEntity({
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
    purchaseInvoiceEntity.data = deps.objClean(purchaseInvoiceEntity.data)

    // 4. database operation
    const response = await deps.createPurchaseInvoiceRepository.handle(purchaseInvoiceEntity.data)

    await deps.updatePurchaseOrderInvoice.delete(input.data.purchase_order._id)
    await deps.updatePurchaseOrderInvoice.add(input.data.purchase_order._id)
    await deps.updatePurchaseInvoiceRepository.handle(input._id, {
      is_revised: true,
    })
    // 5. output
    return { inserted_id: response.inserted_id }
  }
}
