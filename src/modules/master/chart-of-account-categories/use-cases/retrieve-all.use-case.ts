import type { IPagination, IQuery } from '@point-hub/papi'

import { IRetrieveChartOfAccountCategoryOutput } from '../repositories/retrieve.repository'
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
export interface IOutput {
  data: IRetrieveChartOfAccountCategoryOutput[]
  pagination: IPagination
}

export class RetrieveAllChartOfAccountCategoryUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveAllChartOfAccountCategoryRepository.handle(input.query, options)
    // 2. output
    return {
      data: response.data,
      pagination: response.pagination,
    }
  }
}
