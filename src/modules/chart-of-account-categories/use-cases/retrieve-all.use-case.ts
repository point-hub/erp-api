import type { IQuery, IRetrieveAllOutput } from '@point-hub/papi'

import { IRetrieveAllChartOfAccountCategoryRepository } from '../repositories/retrieve-all.repository'

export interface IInput {
  query: IQuery
}
export interface IDeps {
  retrieveAllChartOfAccountCategoryRepository: IRetrieveAllChartOfAccountCategoryRepository
}
export interface IOptions {
  session: unknown
}

export class RetrieveAllChartOfAccountCategoryUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IRetrieveAllOutput> {
    // 1. database operation
    const response = await deps.retrieveAllChartOfAccountCategoryRepository.handle(input.query, options)
    // 2. output
    return {
      data: response.data,
      pagination: response.pagination,
    }
  }
}
