import type { IQuery, IRetrieveAllOutput } from '@point-hub/papi'

import { IRetrieveBranchOutput } from '../repositories/retrieve.repository'
import { IRetrieveAllBranchRepository } from '../repositories/retrieve-all.repository'

export interface IInput {
  query: IQuery
}
export interface IDeps {
  retrieveAllRepository: IRetrieveAllBranchRepository
}
export interface IOptions {
  session: unknown
}
export interface IOutput {
  data: IRetrieveBranchOutput[]
}

export class RetrieveAllBranchUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IRetrieveAllOutput> {
    const response = await deps.retrieveAllRepository.handle(input.query, options)
    return {
      data: response.data,
      pagination: response.pagination,
    }
  }
}
