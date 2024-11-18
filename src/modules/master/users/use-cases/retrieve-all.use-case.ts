import type { IPagination, IQuery } from '@point-hub/papi'

import { IRetrieveUserOutput } from '../repositories/retrieve.repository'
import { IRetrieveAllUserRepository } from '../repositories/retrieve-all.repository'

export interface IInput {
  query: IQuery
}

export interface IDeps {
  retrieveAllUserRepository: IRetrieveAllUserRepository
}

export interface IOutput {
  data: IRetrieveUserOutput[]
  pagination: IPagination
}

export class RetrieveAllUserUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveAllUserRepository.handle(input.query)
    // 2. output
    return {
      data: response.data as IRetrieveUserOutput[],
      pagination: response.pagination,
    }
  }
}
