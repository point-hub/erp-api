import type { IPagination, IQuery } from '@point-hub/papi'

import { IRetrieveItemCategoryOutput } from '../repositories/retrieve.repository'
import { IRetrieveAllItemCategoryRepository } from '../repositories/retrieve-all.repository'

export interface IInput {
  query: IQuery
}

export interface IDeps {
  retrieveAllItemCategoryRepository: IRetrieveAllItemCategoryRepository
}

export interface IOutput {
  data: IRetrieveItemCategoryOutput[]
  pagination: IPagination
}

export class RetrieveAllItemCategoryUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveAllItemCategoryRepository.handle(input.query)
    // 2. output
    return {
      data: response.data,
      pagination: response.pagination,
    }
  }
}
