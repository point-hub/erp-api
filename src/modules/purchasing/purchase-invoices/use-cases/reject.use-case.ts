import type { ISchemaValidation } from '@point-hub/papi'

import { IAuth } from '@/modules/master/users/interface'

import { PurchaseInvoiceEntity } from '../entity'
import { IRejectPurchaseInvoiceRepository } from '../repositories/reject.repository'
import { rejectValidation } from '../validations/reject.validation'

export interface IInput {
  auth: IAuth
  _id: string
  reason: string
}

export interface IDeps {
  schemaValidation: ISchemaValidation
  rejectPurchaseInvoiceRepository: IRejectPurchaseInvoiceRepository
}

export interface IOutput {
  matched_count: number
  modified_count: number
}

export class RejectPurchaseInvoiceUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, rejectValidation)
    // 2. define entity
    const purchaseInvoiceEntity = new PurchaseInvoiceEntity({
      approval_date: new Date(),
      approval_status: 'rejected',
      rejected_reason: input.reason,
    })
    // 3. database operation
    const response = await deps.rejectPurchaseInvoiceRepository.handle(input._id, purchaseInvoiceEntity.data)
    // 4. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
