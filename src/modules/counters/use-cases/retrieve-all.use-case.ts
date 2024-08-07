import type { IQuery } from '@point-hub/papi'

import { IRetrieveCounterOutput } from '../repositories/retrieve.repository'
import { IRetrieveAllCounterRepository } from '../repositories/retrieve-all.repository'

export interface IInput {
  query: IQuery
}
export interface IDeps {
  retrieveAllCounterRepository: IRetrieveAllCounterRepository
}
export interface IOptions {
  session: unknown
}

export interface IOutput {
  data: IRetrieveCounterOutput[]
  pagination: {
    page: number
    page_count: number
    page_size: number
    total_document: number
  }
}

export class RetrieveAllCounterUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveAllCounterRepository.handle(input.query, options)
    // 2. output
    return {
      data: response.data,
      pagination: response.pagination,
    }
  }
}
