import type { IPagination, IQuery } from '@point-hub/papi'

import { IRetrieveChartOfAccountTypeOutput } from '../repositories/retrieve.repository'
import { IRetrieveAllChartOfAccountTypeRepository } from '../repositories/retrieve-all.repository'

export interface IInput {
  query: IQuery
}

export interface IDeps {
  retrieveAllChartOfAccountTypeRepository: IRetrieveAllChartOfAccountTypeRepository
}
export interface IOptions {
  session: unknown
}
export interface IOutput {
  data: IRetrieveChartOfAccountTypeOutput[]
  pagination: IPagination
}

export class RetrieveAllChartOfAccountTypeUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveAllChartOfAccountTypeRepository.handle(input.query, options)
    // 2. output
    return {
      data: response.data,
      pagination: response.pagination,
    }
  }
}
