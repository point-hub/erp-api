import type { IPagination, IQuery } from '@point-hub/papi'

import { IRetrieveCustomerOutput } from '../repositories/retrieve.repository'
import { IRetrieveAllCustomerRepository } from '../repositories/retrieve-all.repository'

export interface IInput {
  query: IQuery
}

export interface IDeps {
  retrieveAllCustomerRepository: IRetrieveAllCustomerRepository
}

export interface IOutput {
  data: IRetrieveCustomerOutput[]
  pagination: IPagination
}

export class RetrieveAllCustomerUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveAllCustomerRepository.handle(input.query)
    // 2. output
    return {
      data: response.data,
      pagination: response.pagination,
    }
  }
}
