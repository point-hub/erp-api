import { IAuthBy } from '@/modules/master/users/interface'

import { IBranch, IDetails, IRetrievePurchaseRequestRepository } from '../repositories/retrieve.repository'

export interface IInput {
  _id: string
}
export interface IDeps {
  retrievePurchaseRequestRepository: IRetrievePurchaseRequestRepository
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
  approval_to: IAuthBy
  created_by: IAuthBy
  updated_by: IAuthBy
  approval_date: Date
  created_date: Date
  updated_date: Date
}

export class RetrievePurchaseRequestUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrievePurchaseRequestRepository.handle(input._id, options)
    // 2. output
    return {
      _id: response._id,
      revised_count: response.revised_count,
      form_number: response.form_number,
      required_date: response.required_date,
      branch: response.branch,
      details: response.details,
      notes: response.notes,
      approval_to: response.approval_to,
      created_by: response.created_by,
      updated_by: response.updated_by,
      approval_date: response.approval_date,
      created_date: response.created_date,
      updated_date: response.updated_date,
    }
  }
}
