import type { ISchemaValidation } from '@point-hub/papi'

import { ICreateCounterRepository } from '@/modules/counters/repositories/create.repository'
import { IRetrieveAllCounterRepository } from '@/modules/counters/repositories/retrieve-all.repository'
import { IUpdateCounterRepository } from '@/modules/counters/repositories/update.repository'
import { IGenerateFormNumber } from '@/modules/counters/utils/generate'
import { IAuth, IAuthReference } from '@/modules/master/users/interface'

import { formNumberPrefix, PurchaseRequestEntity } from '../entity'
import { IBranchReference, IDetail, TypeApprovalStatus } from '../interface'
import { ICreatePurchaseRequestRepository } from '../repositories/create.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  auth: IAuth
  data: {
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
  createPurchaseRequestRepository: ICreatePurchaseRequestRepository
  retrieveAllCounterRepository: IRetrieveAllCounterRepository
  createCounterRepository: ICreateCounterRepository
  updateCounterRepository: IUpdateCounterRepository
  schemaValidation: ISchemaValidation
  generateFormNumber: IGenerateFormNumber
  dateFormat(date: Date | number | string, format: string): string
}
export interface IOptions {
  session?: unknown
}
export interface IOutput {
  inserted_id: string
}
export class CreatePurchaseRequestUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input.data, createValidation)
    // 2. generate form number
    const code = formNumberPrefix + deps.dateFormat(new Date(), 'yyMM')
    let formNumber = code
    const counters = await deps.retrieveAllCounterRepository.handle(
      { filter: { name: 'purchasing.purchase_requests', code: code } },
      options,
    )
    if (!counters.data.length) {
      await deps.createCounterRepository.handle(
        {
          name: 'purchasing.purchase_requests',
          code: code,
          count: 1,
        },
        options,
      )
      formNumber += '0001'
    } else {
      formNumber += (Number(counters.data[0].count) + 1).toString().padStart(4, '0')
      await deps.updateCounterRepository.handle(
        counters.data[0]._id,
        { count: Number(counters.data[0].count) + 1 },
        options,
      )
    }
    // 3. define entity
    const purchaseRequestEntity = new PurchaseRequestEntity({
      revised_count: 0,
      form_number: formNumber,
      required_date: input.data.required_date,
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
    const cleanEntity = deps.cleanObject(purchaseRequestEntity.data)
    // 4. database operation
    const response = await deps.createPurchaseRequestRepository.handle(cleanEntity, options)
    // 5. output
    return { inserted_id: response.inserted_id }
  }
}
