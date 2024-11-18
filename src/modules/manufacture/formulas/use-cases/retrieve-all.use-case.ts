import type { IPagination, IQuery } from '@point-hub/papi'

import { IRetrieveFormulaOutput } from '../repositories/retrieve.repository'
import { IRetrieveAllFormulaRepository } from '../repositories/retrieve-all.repository'

export interface IInput {
  query: IQuery
}

export interface IDeps {
  retrieveAllFormulaRepository: IRetrieveAllFormulaRepository
}
export interface IOptions {
  session: unknown
}
export interface IOutput {
  data: IRetrieveFormulaOutput[]
  pagination: IPagination
}

export class RetrieveAllFormulaUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveAllFormulaRepository.handle(input.query, options)
    // 2. output
    return {
      data: response.data,
      pagination: response.pagination,
    }
  }
}
