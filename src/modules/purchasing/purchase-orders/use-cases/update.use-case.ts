import { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import { IAuth, IAuthReference } from '@/modules/master/users/interface'

import { IUpdatePurchaseRequestReference } from '../../purchase-requests/utils/update-reference'
import { PurchaseOrderEntity } from '../entity'
import { IBranchReference, IDetail, IPurchaseRequest, ISupplier, TypeApprovalStatus } from '../interface'
import { ICreatePurchaseOrderRepository } from '../repositories/create.repository'
import { IUpdatePurchaseOrderRepository } from '../repositories/update.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  _id: string
  auth: IAuth
  data: {
    required_date: Date
    required_down_payment: boolean
    revised_count: number
    form_number: string
    purchase_request: IPurchaseRequest
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
  createPurchaseOrderRepository: ICreatePurchaseOrderRepository
  updatePurchaseOrderRepository: IUpdatePurchaseOrderRepository
  updatePurchaseRequestReference: IUpdatePurchaseRequestReference
}

export interface IOutput {
  inserted_id: string
}
export class UpdatePurchaseOrderUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input.data, createValidation)
    // 3. define entity
    const purchaseOrderEntity = new PurchaseOrderEntity({
      revised_count: input.data.revised_count,
      form_number: input.data.form_number,
      purchase_request: {
        _id: input.data.purchase_request._id,
        label: input.data.purchase_request.label,
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
    purchaseOrderEntity.data = deps.objClean(purchaseOrderEntity.data)

    // 4. database operation
    const response = await deps.createPurchaseOrderRepository.handle(purchaseOrderEntity.data)

    const details = purchaseOrderEntity.data.details?.map((el) => ({
      uuid: el.uuid as string,
      quantity: el.quantity as number,
    }))

    const reference = {
      ref_id: response.inserted_id,
      ref_name: 'purchase_orders',
      ref_number: 'xx',
      ref_date: purchaseOrderEntity.data.created_date as Date,
      details: details ?? [],
    }
    await deps.updatePurchaseRequestReference.delete(input.data.purchase_request._id, 'purchase_orders', input._id)
    await deps.updatePurchaseRequestReference.add(input.data.purchase_request, reference)
    await deps.updatePurchaseOrderRepository.handle(input._id, {
      is_revised: true,
    })
    // 5. output
    return { inserted_id: response.inserted_id }
  }
}
