import type { ISchemaValidation } from '@point-hub/papi'

import { IAuth } from '@/modules/master/users/interface'

import { SalesQuotationEntity } from '../entity'
import { ISendEmailApprovalRepository } from '../repositories/send-email-approval.repository'
import { sendEmailApprovalValidation } from '../validations/send-email-approval.validation'

export interface IInput {
  auth: IAuth
  _id: string
  data: {
    approval_to?: string
    updated_by?: string
  }
}
export interface IDeps {
  schemaValidation: ISchemaValidation
  updateSalesQuotationRepository: ISendEmailApprovalRepository
}
export interface IOptions {
  session?: unknown
}
export interface IOutput {
  matched_count: number
  modified_count: number
}

export class SendEmailApprovalUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, sendEmailApprovalValidation)
    // 2. define entity
    const salesQuotationEntity = new SalesQuotationEntity({
      updated_by: {
        _id: input.auth._id,
        name: input.auth.name,
        username: input.auth.username,
        email: input.auth.email,
        label: input.auth.username,
      },
    })
    salesQuotationEntity.generateUpdatedDate()
    // 3. database operation
    const response = await deps.updateSalesQuotationRepository.handle(input._id, salesQuotationEntity.data, options)
    // 4. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
