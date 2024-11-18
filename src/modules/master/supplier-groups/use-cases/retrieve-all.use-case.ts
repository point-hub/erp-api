import type { IPagination, IQuery } from '@point-hub/papi'

import { IRetrieveSupplierGroupOutput } from '../repositories/retrieve.repository'
import { IRetrieveAllSupplierGroupRepository } from '../repositories/retrieve-all.repository'

export interface IInput {
  query: IQuery
}

export interface IDeps {
  retrieveAllSupplierGroupRepository: IRetrieveAllSupplierGroupRepository
}
export interface IOptions {
  session: unknown
}
export interface IOutput {
  data: IRetrieveSupplierGroupOutput[]
  pagination: IPagination
}

export class RetrieveAllSupplierGroupUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveAllSupplierGroupRepository.handle(input.query, options)
    // 2. output
    return {
      data: response.data,
      pagination: response.pagination,
    }
  }
}
