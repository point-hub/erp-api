import type { IQuery } from '@point-hub/papi'

import {
  IRetrieveAllChartOfAccountOutput,
  IRetrieveAllChartOfAccountRepository,
} from '../repositories/retrieve-all.repository'

export interface IInput {
  query: IQuery
}
export interface IDeps {
  retrieveAllChartOfAccountRepository: IRetrieveAllChartOfAccountRepository
}
export interface IOptions {
  session: unknown
}

export class RetrieveAllChartOfAccountUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IRetrieveAllChartOfAccountOutput> {
    // 1. database operation
    const response = await deps.retrieveAllChartOfAccountRepository.handle(input.query, options)
    // 2. output
    return {
      data: response.data,
      pagination: response.pagination,
    }
  }
}
