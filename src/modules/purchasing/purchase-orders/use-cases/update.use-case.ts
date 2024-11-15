import type { ISchemaValidation } from '@point-hub/papi'

import { ICreateCounterRepository } from '@/modules/counters/repositories/create.repository'
import { IRetrieveAllCounterRepository } from '@/modules/counters/repositories/retrieve-all.repository'
import { IUpdateCounterRepository } from '@/modules/counters/repositories/update.repository'
import { IAuth, IAuthReference } from '@/modules/master/users/interface'

import { PurchaseOrderEntity } from '../entity'
import { IBranchReference, IDetail, TypeApprovalStatus } from '../interface'
import { ICreatePurchaseOrderRepository } from '../repositories/create.repository'
import { IUpdatePurchaseOrderRepository } from '../repositories/update.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  _id: string
  auth: IAuth
  data: {
    revised_count: number
    form_number: string
    required_date: Date
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
  updatePurchaseOrderRepository: IUpdatePurchaseOrderRepository
  dateFormat(date: Date | number | string, format: string): string
}
export interface IOptions {
  session?: unknown
}
export interface IOutput {
  inserted_id: string
}
export class UpdatePurchaseOrderUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input.data, createValidation)
    // 3. define entity
    const purchaseOrderEntity = new PurchaseOrderEntity({
      revised_count: input.data.revised_count,
      form_number: input.data.form_number,
      required_date: input.data.required_date,
      branch: input.data.branch,
      details: input.data.details,
      notes: input.data.notes,
      is_revised: false,
      is_finished: false,
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
    await deps.updatePurchaseOrderRepository.handle(
      input._id,
      {
        is_revised: true,
      },
      options,
    )
    // 5. output
    return { inserted_id: response.inserted_id }
  }
}
