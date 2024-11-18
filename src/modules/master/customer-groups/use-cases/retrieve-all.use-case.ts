import type { IPagination, IQuery } from '@point-hub/papi'

import { IRetrieveCustomerGroupOutput } from '../repositories/retrieve.repository'
import { IRetrieveAllCustomerGroupRepository } from '../repositories/retrieve-all.repository'

export interface IInput {
  query: IQuery
}

export interface IDeps {
  retrieveAllCustomerGroupRepository: IRetrieveAllCustomerGroupRepository
}
export interface IOptions {
  session: unknown
}
export interface IOutput {
  data: IRetrieveCustomerGroupOutput[]
  pagination: IPagination
}

export class RetrieveAllCustomerGroupUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveAllCustomerGroupRepository.handle(input.query, options)
    // 2. output
    return {
      data: response.data,
      pagination: response.pagination,
    }
  }
}
