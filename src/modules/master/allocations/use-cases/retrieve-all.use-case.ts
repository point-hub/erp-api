import type { IPagination, IQuery } from '@point-hub/papi'

import { IRetrieveAllocationOutput } from '../repositories/retrieve.repository'
import { IRetrieveAllAllocationRepository } from '../repositories/retrieve-all.repository'

export interface IInput {
  query: IQuery
}

export interface IDeps {
  retrieveAllAllocationRepository: IRetrieveAllAllocationRepository
}
export interface IOptions {
  session: unknown
}
export interface IOutput {
  data: IRetrieveAllocationOutput[]
  pagination: IPagination
}

export class RetrieveAllAllocationUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveAllAllocationRepository.handle(input.query, options)
    // 2. output
    return {
      data: response.data,
      pagination: response.pagination,
    }
  }
}
