import { IAuthReference } from '@/modules/master/users/interface'

import { IBranch, IDetails, IRetrievePurchaseRequestRepository } from '../repositories/retrieve.repository'

export interface IInput {
  _id: string
}

export interface IDeps {
  retrievePurchaseRequestRepository: IRetrievePurchaseRequestRepository
}

export interface IOutput {
  _id: string
  revised_count: number
  form_number: string
  required_date: Date
  branch: IBranch
  details: IDetails[]
  notes: string
  approval_status: 'pending' | 'approved' | 'rejected'
  approval_to: IAuthReference
  rejected_reason: string
  created_by: IAuthReference
  updated_by: IAuthReference
  approval_date: Date
  created_date: Date
  updated_date: Date
  deleted_by: IAuthReference
  deleted_date: Date
  deleted_reason: string
  is_deleted: boolean
}

export class RetrievePurchaseRequestUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrievePurchaseRequestRepository.handle(input._id)
    // 2. output
    return {
      _id: response._id,
      revised_count: response.revised_count,
      form_number: response.form_number,
      required_date: response.required_date,
      branch: response.branch,
      details: response.details,
      notes: response.notes,
      approval_status: response.approval_status,
      approval_to: response.approval_to,
      rejected_reason: response.rejected_reason,
      created_by: response.created_by,
      updated_by: response.updated_by,
      approval_date: response.approval_date,
      created_date: response.created_date,
      updated_date: response.updated_date,
      deleted_by: response.deleted_by,
      deleted_date: response.deleted_date,
      deleted_reason: response.deleted_reason,
      is_deleted: response.is_deleted,
    }
  }
}
