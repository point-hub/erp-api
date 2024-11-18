import type { IPagination, IQuery } from '@point-hub/papi'

import { IRetrieveSupplierOutput } from '../repositories/retrieve.repository'
import { IRetrieveAllSupplierRepository } from '../repositories/retrieve-all.repository'

export interface IInput {
  query: IQuery
}

export interface IDeps {
  retrieveAllSupplierRepository: IRetrieveAllSupplierRepository
}
export interface IOptions {
  session: unknown
}
export interface IOutput {
  data: IRetrieveSupplierOutput[]
  pagination: IPagination
}

export class RetrieveAllSupplierUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveAllSupplierRepository.handle(input.query, options)
    // 2. output
    return {
      data: response.data,
      pagination: response.pagination,
    }
  }
}
