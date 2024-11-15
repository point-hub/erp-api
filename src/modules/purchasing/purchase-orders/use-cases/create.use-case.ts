import type { ISchemaValidation } from '@point-hub/papi'

import { ICreateCounterRepository } from '@/modules/counters/repositories/create.repository'
import { IRetrieveAllCounterRepository } from '@/modules/counters/repositories/retrieve-all.repository'
import { IUpdateCounterRepository } from '@/modules/counters/repositories/update.repository'
import { IGenerateFormNumber } from '@/modules/counters/utils/generate-form-number'
import { IAuth, IAuthReference } from '@/modules/master/users/interface'

import { IUpdatePurchaseRequestRepository } from '../../purchase-requests/repositories/update.repository'
import { PurchaseOrderEntity } from '../entity'
import {
  IBranchReference,
  IDetail,
  IPurchaseRequestReference,
  ISupplierReference,
  TypeApprovalStatus,
} from '../interface'
import { ICreatePurchaseOrderRepository } from '../repositories/create.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  auth: IAuth
  data: {
    required_date: Date
    purchase_request: IPurchaseRequestReference
    supplier: ISupplierReference
    branch: IBranchReference
    details: IDetail[]
    notes?: string
    approval_to: IAuthReference
    approval_status: TypeApprovalStatus
    created_date?: Date
  }
}
export interface IDeps {
  cleanObject(object: object): object
  createPurchaseOrderRepository: ICreatePurchaseOrderRepository
  retrieveAllCounterRepository: IRetrieveAllCounterRepository
  createCounterRepository: ICreateCounterRepository
  updateCounterRepository: IUpdateCounterRepository
  schemaValidation: ISchemaValidation
  generateFormNumber: IGenerateFormNumber
  updatePurchaseRequestRepository: IUpdatePurchaseRequestRepository
  dateFormat(date: Date | number | string, format: string): string
}
export interface IOptions {
  session?: unknown
}
export interface IOutput {
  inserted_id: string
}
export class CreatePurchaseOrderUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input.data, createValidation)
    // 2. generate form number
    const formNumber = await deps.generateFormNumber.handle('PR', 'purchasing.purchase_orders', options)
    // 3. define entity
    const purchaseOrderEntity = new PurchaseOrderEntity({
      revised_count: 0,
      form_number: formNumber,
      required_date: input.data.required_date,
      purchase_request: input.data.purchase_request,
      supplier: input.data.supplier,
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
        label: input.auth.username,
        email: input.auth.email,
      },
      created_date: new Date(),
    })
    const cleanEntity = deps.cleanObject(purchaseOrderEntity.data)
    // 4. database operation
    const response = await deps.createPurchaseOrderRepository.handle(cleanEntity, options)
    await deps.updatePurchaseRequestRepository.handle(
      input.data.purchase_request._id as string,
      {
        is_finished: true,
      },
      options,
    )
    // 5. output
    return { inserted_id: response.inserted_id }
  }
}
