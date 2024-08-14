import type { IQuery } from '@point-hub/papi'

import { IRetrieveHealthOutput } from '../repositories/retrieve.repository'
import { IRetrieveAllHealthRepository } from '../repositories/retrieve-all.repository'

export interface IInput {
  query: IQuery
}
export interface IDeps {
  retrieveAllHealthRepository: IRetrieveAllHealthRepository
}
export interface IOptions {
  session: unknown
}

export interface IOutput {
  data: IRetrieveHealthOutput[]
  pagination: {
    page: number
    page_count: number
    page_size: number
    total_document: number
  }
}

export class RetrieveAllHealthUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveAllHealthRepository.handle(input.query, options)
    // 2. output
    return {
      data: response.data,
      pagination: response.pagination,
    }
  }
}
