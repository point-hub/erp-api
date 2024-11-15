import type { ISchemaValidation } from '@point-hub/papi'

import { IAuth } from '@/modules/master/users/interface'

import { PurchaseOrderEntity } from '../entity'
import { IApprovePurchaseOrderRepository } from '../repositories/approve.repository'
import { approveValidation } from '../validations/approve.validation'

export interface IInput {
  auth: IAuth
  _id: string
}
export interface IDeps {
  schemaValidation: ISchemaValidation
  approvePurchaseOrderRepository: IApprovePurchaseOrderRepository
}
export interface IOptions {
  session?: unknown
}
export interface IOutput {
  matched_count: number
  modified_count: number
}

export class ApprovePurchaseOrderUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, approveValidation)
    // 2. define entity
    const purchaseOrderEntity = new PurchaseOrderEntity({
      approval_date: new Date(),
      approval_status: 'approved',
    })
    // 3. database operation
    const response = await deps.approvePurchaseOrderRepository.handle(input._id, purchaseOrderEntity.data, options)
    // 4. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
