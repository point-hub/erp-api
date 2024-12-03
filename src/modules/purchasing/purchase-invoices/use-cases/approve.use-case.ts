import type { ISchemaValidation } from '@point-hub/papi'

import { IAuth } from '@/modules/master/users/interface'

import { PurchaseInvoiceEntity } from '../entity'
import { IApprovePurchaseInvoiceRepository } from '../repositories/approve.repository'
import { approveValidation } from '../validations/approve.validation'

export interface IInput {
  auth: IAuth
  _id: string
}

export interface IDeps {
  schemaValidation: ISchemaValidation
  approvePurchaseInvoiceRepository: IApprovePurchaseInvoiceRepository
}

export interface IOutput {
  matched_count: number
  modified_count: number
}

export class ApprovePurchaseInvoiceUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, approveValidation)
    // 2. define entity
    const purchaseInvoiceEntity = new PurchaseInvoiceEntity({
      approval_date: new Date(),
      approval_status: 'approved',
    })
    // 3. database operation
    const response = await deps.approvePurchaseInvoiceRepository.handle(input._id, purchaseInvoiceEntity.data)
    // 4. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
