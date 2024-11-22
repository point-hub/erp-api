import type { ISchemaValidation } from '@point-hub/papi'

import { IAuth } from '@/modules/master/users/interface'

import { PurchaseRequestEntity } from '../entity'
import { IApprovePurchaseRequestRepository } from '../repositories/approve.repository'
import { approveValidation } from '../validations/approve.validation'

export interface IInput {
  auth: IAuth
  _id: string
}

export interface IDeps {
  schemaValidation: ISchemaValidation
  approvePurchaseRequestRepository: IApprovePurchaseRequestRepository
}

export interface IOutput {
  matched_count: number
  modified_count: number
}

export class ApprovePurchaseRequestUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, approveValidation)
    // 2. define entity
    const purchaseRequestEntity = new PurchaseRequestEntity({
      approval_date: new Date(),
      approval_status: 'approved',
    })
    // 3. database operation
    const response = await deps.approvePurchaseRequestRepository.handle(input._id, purchaseRequestEntity.data)
    // 4. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
