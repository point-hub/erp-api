import type { ISchemaValidation } from '@point-hub/papi'

import { IAuth } from '@/modules/master/users/interface'

import { IUpdatePurchaseRequestReference } from '../../purchase-requests/utils/update-reference'
import { IDeletePurchaseOrderRepository } from '../repositories/delete.repository'
import { deleteValidation } from '../validations/delete.validation'

export interface IInput {
  _id: string
  auth: IAuth
  reason: string
}

export interface IDeps {
  schemaValidation: ISchemaValidation
  deletePurchaseOrderRepository: IDeletePurchaseOrderRepository
  updatePurchaseRequestReference?: IUpdatePurchaseRequestReference
}

export interface IOutput {
  matched_count: number
  modified_count: number
}

export class DeletePurchaseOrderUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, deleteValidation)
    // 2. database operation
    const response = await deps.deletePurchaseOrderRepository.handle(input._id, {
      deleted_by: {
        _id: input.auth._id,
        label: input.auth.username,
        email: input.auth.email,
      },
      deleted_reason: input.reason,
      deleted_date: new Date(),
      is_deleted: true,
    })
    // deps.updatePurchaseRequestReference.delete()
    // 3. output
    return { matched_count: response.matched_count, modified_count: response.modified_count }
  }
}
