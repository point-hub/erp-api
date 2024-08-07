import type { IPagination, IQuery } from '@point-hub/papi'

import { IRetrieveAllocationGroupOutput } from '../repositories/retrieve.repository'
import { IRetrieveAllAllocationGroupRepository } from '../repositories/retrieve-all.repository'

export interface IInput {
  query: IQuery
}
export interface IDeps {
  retrieveAllRepository: IRetrieveAllAllocationGroupRepository
}
export interface IOptions {
  session: unknown
}
export interface IOutput {
  data: IRetrieveAllocationGroupOutput[]
  pagination: IPagination
}

export class RetrieveAllAllocationGroupUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveAllRepository.handle(input.query, options)
    // 2. output
    return {
      data: response.data,
      pagination: response.pagination,
    }
  }
}
