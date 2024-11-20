import { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import { IGenerateFormNumber } from '@/modules/counters/utils/generate-form-number'
import { IAuth, IAuthReference } from '@/modules/master/users/interface'

import { IUpdatePurchaseRequestReference } from '../../purchase-requests/utils/update-reference'
import { PurchaseOrderEntity } from '../entity'
import { IBranchReference, IDetail, TypeApprovalStatus } from '../interface'
import { ICreatePurchaseOrderRepository } from '../repositories/create.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  auth: IAuth
  data: {
    purchase_request: {
      _id: string
      label: string
    }
    supplier: {
      _id: string
      label: string
      code: string
      name: string
    }
    branch: IBranchReference
    details: IDetail[]
    notes?: string
    approval_to: IAuthReference
    approval_status: TypeApprovalStatus
    created_date?: Date
  }
}

export interface IDeps {
  objClean: IObjClean
  createPurchaseOrderRepository: ICreatePurchaseOrderRepository
  schemaValidation: ISchemaValidation
  generateFormNumber: IGenerateFormNumber
  dateFormat(date: Date | number | string, format: string): string
  updatePurchaseRequestReference: IUpdatePurchaseRequestReference
}

export interface IOutput {
  inserted_id: string
}
export class CreatePurchaseOrderUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input.data, createValidation)
    // 2. generate form number
    const formNumber = await deps.generateFormNumber.handle('PO', 'purchasing.purchase_orders')
    // 3. define entity
    const purchaseOrderEntity = new PurchaseOrderEntity({
      revised_count: 0,
      form_number: formNumber,
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
      branch: input.data.branch,
      details: input.data.details,
      notes: input.data.notes,
      is_finished: false,
      is_revised: false,
      approval_request_by: {
        _id: input.auth._id,
        label: input.auth.username,
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
    await deps.updatePurchaseRequestReference.handle(input.data.purchase_request, reference)
    // 5. output
    return { inserted_id: response.inserted_id }
  }
}
