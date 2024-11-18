import { IAuthReference } from '../../users/interface'
import { IChartOfAccountCategory, IChartOfAccountType } from '../interface'
import { IRetrieveChartOfAccountRepository } from '../repositories/retrieve.repository'

export interface IInput {
  _id: string
}

export interface IDeps {
  retrieveChartOfAccountRepository: IRetrieveChartOfAccountRepository
}
export interface IOptions {
  session: unknown
}
export interface IOutput {
  _id: string
  type: IChartOfAccountType
  category: IChartOfAccountCategory
  label: string
  number: string
  name: string
  subledger: string
  notes: string
  created_by: IAuthReference
  updated_by: IAuthReference
  created_date: Date
  updated_date: Date
}

export class RetrieveChartOfAccountUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveChartOfAccountRepository.handle(input._id, options)
    // 2. output
    return {
      _id: response._id,
      type: response.type,
      category: response.category,
      label: response.label,
      number: response.number,
      name: response.name,
      subledger: response.subledger,
      notes: response.notes,
      created_by: response.created_by,
      updated_by: response.updated_by,
      created_date: response.created_date,
      updated_date: response.updated_date,
    }
  }
}
