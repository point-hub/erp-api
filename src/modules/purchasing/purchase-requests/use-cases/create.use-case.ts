import { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import { ICreateCounterRepository } from '@/modules/counters/repositories/create.repository'
import { IRetrieveAllCounterRepository } from '@/modules/counters/repositories/retrieve-all.repository'
import { IUpdateCounterRepository } from '@/modules/counters/repositories/update.repository'
import { IGenerateFormNumber } from '@/modules/counters/utils/generate-form-number'
import { IAuth, IAuthReference } from '@/modules/master/users/interface'

import { PurchaseRequestEntity } from '../entity'
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
  objClean: IObjClean
  createPurchaseRequestRepository: ICreatePurchaseRequestRepository
  retrieveAllCounterRepository: IRetrieveAllCounterRepository
  createCounterRepository: ICreateCounterRepository
  updateCounterRepository: IUpdateCounterRepository
  schemaValidation: ISchemaValidation
  generateFormNumber: IGenerateFormNumber
  dateFormat(date: Date | number | string, format: string): string
  tokenGenerate(): string
}

export interface IOutput {
  inserted_id: string
}
export class CreatePurchaseRequestUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input.data, createValidation)
    // 2. generate form number
    const formNumber = await deps.generateFormNumber.handle('PR', 'purchasing.purchase_requests')
    // 3. define entity
    input.data.details = input.data.details.map((obj) => {
      return {
        ...obj,
        uuid: deps.tokenGenerate(),
      }
    })
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
      references: [],
    })
    purchaseRequestEntity.data = deps.objClean(purchaseRequestEntity.data)
    // 4. database operation
    const response = await deps.createPurchaseRequestRepository.handle(purchaseRequestEntity.data)
    // 5. output
    return { inserted_id: response.inserted_id }
  }
}
