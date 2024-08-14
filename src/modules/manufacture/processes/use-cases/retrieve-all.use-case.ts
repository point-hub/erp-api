import type { IPagination, IQuery } from '@point-hub/papi'

import { IRetrieveProcessOutput } from '../repositories/retrieve.repository'
import { IRetrieveAllProcessRepository } from '../repositories/retrieve-all.repository'

export interface IInput {
  query: IQuery
}
export interface IDeps {
  retrieveAllProcessRepository: IRetrieveAllProcessRepository
}
export interface IOptions {
  session: unknown
}
export interface IOutput {
  data: IRetrieveProcessOutput[]
  pagination: IPagination
}

export class RetrieveAllProcessUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveAllProcessRepository.handle(input.query, options)
    // 2. output
    return {
      data: response.data,
      pagination: response.pagination,
    }
  }
}
