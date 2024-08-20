import type { ISchemaValidation } from '@point-hub/papi'

import { IAuth } from '@/modules/master/users/interface'

import { PurchaseRequestEntity } from '../entity'
import { IUpdatePurchaseRequestRepository } from '../repositories/update.repository'
import { updateValidation } from '../validations/update.validation'

export interface IInput {
  auth: IAuth
  _id: string
  data: {
    code?: string
    name?: string
    address?: string
    phone?: string
    notes?: string
    updated_by?: string
  }
}
export interface IDeps {
  schemaValidation: ISchemaValidation
  updatePurchaseRequestRepository: IUpdatePurchaseRequestRepository
}
export interface IOptions {
  session?: unknown
}
export interface IOutput {
  matched_count: number
  modified_count: number
}

export class UpdatePurchaseRequestUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, updateValidation)
    // 2. define entity
    const purchaseRequestEntity = new PurchaseRequestEntity({
      code: input.data.code,
      name: input.data.name,
      address: input.data.address ?? '',
      phone: input.data.phone ?? '',
      notes: input.data.notes ?? '',
      updated_by: input.auth._id,
    })
    purchaseRequestEntity.generateUpdatedDate()
    // 3. database operation
    const response = await deps.updatePurchaseRequestRepository.handle(input._id, purchaseRequestEntity.data, options)
    // 4. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
