import type { IPagination, IQuery } from '@point-hub/papi'

import { IRetrieveSalesQuotationOutput } from '../repositories/retrieve.repository'
import { IRetrieveAllSalesQuotationRepository } from '../repositories/retrieve-all.repository'

export interface IInput {
  query: IQuery
}

export interface IDeps {
  retrieveAllSalesQuotationRepository: IRetrieveAllSalesQuotationRepository
}
export interface IOptions {
  session: unknown
}
export interface IOutput {
  data: IRetrieveSalesQuotationOutput[]
  pagination: IPagination
}

export class RetrieveAllSalesQuotationUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveAllSalesQuotationRepository.handle(input.query, options)
    // 2. output
    return {
      data: response.data,
      pagination: response.pagination,
    }
  }
}
