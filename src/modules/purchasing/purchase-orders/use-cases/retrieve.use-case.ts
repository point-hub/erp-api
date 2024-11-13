import { IAuthReference } from '@/modules/master/users/interface'

import { IBranch, IDetails, IRetrievePurchaseOrderRepository } from '../repositories/retrieve.repository'

export interface IInput {
  _id: string
}
export interface IDeps {
  retrievePurchaseOrderRepository: IRetrievePurchaseOrderRepository
}
export interface IOptions {
  session: unknown
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
  created_by: IAuthReference
  updated_by: IAuthReference
  approval_date: Date
  created_date: Date
  updated_date: Date
}

export class RetrievePurchaseOrderUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrievePurchaseOrderRepository.handle(input._id, options)
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
      created_by: response.created_by,
      updated_by: response.updated_by,
      approval_date: response.approval_date,
      created_date: response.created_date,
      updated_date: response.updated_date,
    }
  }
}
