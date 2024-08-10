import type { IRetrieveOutput } from '@point-hub/papi'

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

export class RetrieveChartOfAccountUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IRetrieveOutput> {
    // 1. database operation
    const response = await deps.retrieveChartOfAccountRepository.handle(input._id, options)
    // 2. output
    return {
      _id: response._id,
      type: response.type,
      category: response.category,
      number: response.number,
      name: response.name,
      subledger: response.subledger,
      created_date: response.created_date,
      updated_date: response.updated_date,
    }
  }
}
