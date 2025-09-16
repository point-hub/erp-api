import { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import { IGenerateFormNumber } from '@/modules/counters/utils/generate-form-number'
import { IAuth, IAuthReference } from '@/modules/master/users/interface'

import { IUpdatePurchaseOrderInvoice } from '../../purchase-orders/utils/update-invoice'
import { PurchaseInvoiceEntity } from '../entity'
import { IBranchReference, IDetail, TypeApprovalStatus } from '../interface'
import { ICreatePurchaseInvoiceRepository } from '../repositories/create.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  auth: IAuth
  data: {
    supplier: {
      _id: string
      label: string
      code: string
      name: string
    }
    due_date: Date
    required_date: Date
    required_down_payment: boolean
    branch: IBranchReference
    details: IDetail[]
    subtotal: number
    discount_type: string
    discount: number
    tax_base: number
    tax_type: string
    tax: number
    expedition_fee: number
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
  generateFormNumber: IGenerateFormNumber
  createPurchaseInvoiceRepository: ICreatePurchaseInvoiceRepository
  updatePurchaseOrderInvoice: IUpdatePurchaseOrderInvoice
  tokenGenerate(): string
}

export interface IOutput {
  inserted_id: string
}
export class CreatePurchaseInvoiceUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input.data, createValidation)
    // 2. generate form number
    const formNumber = await deps.generateFormNumber.handle('PI', 'purchasing.purchase_invoices')
    // 3. define entity
    input.data.details = input.data.details.map((obj) => {
      return {
        ...obj,
        quantity_pending: obj.quantity,
      }
    })

    const purchaseInvoiceEntity = new PurchaseInvoiceEntity({
      revised_count: 0,
      form_number: formNumber,
      supplier: {
        _id: input.data.supplier._id,
        label: input.data.supplier.label,
        code: input.data.supplier.code,
        name: input.data.supplier.name,
      },
      due_date: input.data.due_date,
      required_date: input.data.required_date,
      required_down_payment: input.data.required_down_payment,
      branch: input.data.branch,
      details: input.data.details,
      subtotal: input.data.subtotal,
      discount_type: input.data.discount_type,
      discount: input.data.discount,
      tax_base: input.data.tax_base,
      tax_type: input.data.tax_type,
      tax: input.data.tax,
      expedition_fee: input.data.expedition_fee,
      total: input.data.total,
      notes: input.data.notes,
      is_finished: false,
      is_revised: false,
      approval_request_by: {
        _id: input.auth._id,
        label: input.auth.name,
        email: input.auth.email,
      },
      approval_request_date: new Date(),
      approval_to: {
        _id: input.auth._id,
        label: input.auth.name,
        email: input.auth.email,
      },
      created_by: {
        _id: input.auth._id,
        label: input.auth.name,
        email: input.auth.email,
      },
      created_date: new Date(),
      approval_date: new Date(),
      approval_status: 'approved',
    })
    purchaseInvoiceEntity.data = deps.objClean(purchaseInvoiceEntity.data)
    // 4. database operation
    const response = await deps.createPurchaseInvoiceRepository.handle(purchaseInvoiceEntity.data)
    // 5. output
    return { inserted_id: response.inserted_id }
  }
}
