import type { IPagination, IQuery } from '@point-hub/papi'

import { IRetrieveBranchOutput } from '../repositories/retrieve.repository'
import { IRetrieveAllBranchRepository } from '../repositories/retrieve-all.repository'

export interface IInput {
  query: IQuery
}
export interface IDeps {
  retrieveAllBranchRepository: IRetrieveAllBranchRepository
}
export interface IOptions {
  session: unknown
}
export interface IOutput {
  data: IRetrieveBranchOutput[]
  pagination: IPagination
}

export class RetrieveAllBranchUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveAllBranchRepository.handle(input.query, options)
    // 2. output
    return {
      data: response.data,
      pagination: response.pagination,
    }
  }
}
