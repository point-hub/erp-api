import type { ISchemaValidation } from '@point-hub/papi'

import { IAuth } from '@/modules/master/users/interface'

import { PurchaseOrderEntity } from '../entity'
import { IRejectPurchaseOrderRepository } from '../repositories/reject.repository'
import { rejectValidation } from '../validations/reject.validation'

export interface IInput {
  auth: IAuth
  _id: string
  reason: string
}
export interface IDeps {
  schemaValidation: ISchemaValidation
  rejectPurchaseOrderRepository: IRejectPurchaseOrderRepository
}
export interface IOptions {
  session?: unknown
}
export interface IOutput {
  matched_count: number
  modified_count: number
}

export class RejectPurchaseOrderUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, rejectValidation)
    // 2. define entity
    const purchaseOrderEntity = new PurchaseOrderEntity({
      approval_date: new Date(),
      approval_status: 'rejected',
      rejected_reason: input.reason,
    })
    // 3. database operation
    const response = await deps.rejectPurchaseOrderRepository.handle(input._id, purchaseOrderEntity.data, options)
    // 4. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
