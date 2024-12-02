import type { ISchemaValidation } from '@point-hub/papi'

import { IAuth } from '@/modules/master/users/interface'

import { IUpdatePurchaseOrderReference } from '../../purchase-orders/utils/update-reference'
import { IDeleteDownPaymentRepository } from '../repositories/delete.repository'
import { IRetrieveDownPaymentRepository } from '../repositories/retrieve.repository'
import { deleteValidation } from '../validations/delete.validation'

export interface IInput {
  _id: string
  auth: IAuth
  reason: string
}

export interface IDeps {
  schemaValidation: ISchemaValidation
  retrieveDownPaymentRepository: IRetrieveDownPaymentRepository
  deleteDownPaymentRepository: IDeleteDownPaymentRepository
  updatePurchaseOrderReference: IUpdatePurchaseOrderReference
}

export interface IOutput {
  matched_count: number
  modified_count: number
}

export class DeleteDownPaymentUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, deleteValidation)
    // 2. database operation
    const DownPayment = await deps.retrieveDownPaymentRepository.handle(input._id)
    const response = await deps.deleteDownPaymentRepository.handle(input._id, {
      deleted_by: {
        _id: input.auth._id,
        label: input.auth.name,
        email: input.auth.email,
      },
      deleted_reason: input.reason,
      deleted_date: new Date(),
      is_deleted: true,
    })
    await deps.updatePurchaseOrderReference.delete(DownPayment.purchase_order._id, 'down_payments', input._id)
    // 3. output
    return { matched_count: response.matched_count, modified_count: response.modified_count }
  }
}
