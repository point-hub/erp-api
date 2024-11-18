import type { IPagination, IQuery } from '@point-hub/papi'

import { IRetrieveItemOutput } from '../repositories/retrieve.repository'
import { IRetrieveAllItemRepository } from '../repositories/retrieve-all.repository'

export interface IInput {
  query: IQuery
}

export interface IDeps {
  retrieveAllItemRepository: IRetrieveAllItemRepository
}
export interface IOptions {
  session: unknown
}
export interface IOutput {
  data: IRetrieveItemOutput[]
  pagination: IPagination
}

export class RetrieveAllItemUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveAllItemRepository.handle(input.query, options)
    // 2. output
    return {
      data: response.data,
      pagination: response.pagination,
    }
  }
}
