import { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import { IAuth, IAuthReference } from '@/modules/master/users/interface'

import { PurchaseRequestEntity } from '../entity'
import { IBranchReference, IDetail, TypeApprovalStatus } from '../interface'
import { ICreatePurchaseRequestRepository } from '../repositories/create.repository'
import { IUpdatePurchaseRequestRepository } from '../repositories/update.repository'
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
  objClean: IObjClean
  schemaValidation: ISchemaValidation
  createPurchaseRequestRepository: ICreatePurchaseRequestRepository
  updatePurchaseRequestRepository: IUpdatePurchaseRequestRepository
  tokenGenerate(): string
}

export interface IOutput {
  inserted_id: string
}
export class UpdatePurchaseRequestUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input.data, createValidation)
    // 2. define entity
    input.data.details = input.data.details.map((obj) => {
      return {
        ...obj,
        uuid: deps.tokenGenerate(),
      }
    })
    const purchaseRequestEntity = new PurchaseRequestEntity({
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
    purchaseRequestEntity.data = deps.objClean(purchaseRequestEntity.data)
    // 3. database operation
    const response = await deps.createPurchaseRequestRepository.handle(purchaseRequestEntity.data)
    await deps.updatePurchaseRequestRepository.handle(input._id, {
      is_revised: true,
    })
    // 4. output
    return { inserted_id: response.inserted_id }
  }
}
