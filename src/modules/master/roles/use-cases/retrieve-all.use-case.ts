import type { IPagination, IQuery } from '@point-hub/papi'

import { IRetrieveRoleOutput } from '../repositories/retrieve.repository'
import { IRetrieveAllRoleRepository } from '../repositories/retrieve-all.repository'

export interface IInput {
  query: IQuery
}

export interface IDeps {
  retrieveAllRoleRepository: IRetrieveAllRoleRepository
}

export interface IOutput {
  data: IRetrieveRoleOutput[]
  pagination: IPagination
}

export class RetrieveAllRoleUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveAllRoleRepository.handle(input.query)
    // 2. output
    return {
      data: response.data,
      pagination: response.pagination,
    }
  }
}
