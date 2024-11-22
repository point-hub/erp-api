import type { IPagination, IQuery } from '@point-hub/papi'

import { IRetrieveAllocationGroupOutput } from '../repositories/retrieve.repository'
import { IRetrieveAllAllocationGroupRepository } from '../repositories/retrieve-all.repository'

export interface IInput {
  query: IQuery
}

export interface IDeps {
  retrieveAllAllocationGroupRepository: IRetrieveAllAllocationGroupRepository
}

export interface IOutput {
  data: IRetrieveAllocationGroupOutput[]
  pagination: IPagination
}

export class RetrieveAllAllocationGroupUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveAllAllocationGroupRepository.handle(input.query)
    // 2. output
    return {
      data: response.data,
      pagination: response.pagination,
    }
  }
}
