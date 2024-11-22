import type { IPagination, IQuery } from '@point-hub/papi'

import { IRetrieveChartOfAccountOutput } from '../repositories/retrieve.repository'
import { IRetrieveAllChartOfAccountRepository } from '../repositories/retrieve-all.repository'

export interface IInput {
  query: IQuery
}

export interface IDeps {
  retrieveAllChartOfAccountRepository: IRetrieveAllChartOfAccountRepository
}

export interface IOutput {
  data: IRetrieveChartOfAccountOutput[]
  pagination: IPagination
}

export class RetrieveAllChartOfAccountUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveAllChartOfAccountRepository.handle(input.query)
    // 2. output
    return {
      data: response.data,
      pagination: response.pagination,
    }
  }
}
