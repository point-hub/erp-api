import type { IPagination, IQuery } from '@point-hub/papi'

import { IRetrieveWarehouseOutput } from '../repositories/retrieve.repository'
import { IRetrieveAllWarehouseRepository } from '../repositories/retrieve-all.repository'

export interface IInput {
  query: IQuery
}

export interface IDeps {
  retrieveAllWarehouseRepository: IRetrieveAllWarehouseRepository
}
export interface IOptions {
  session: unknown
}
export interface IOutput {
  data: IRetrieveWarehouseOutput[]
  pagination: IPagination
}

export class RetrieveAllWarehouseUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveAllWarehouseRepository.handle(input.query, options)
    // 2. output
    return {
      data: response.data,
      pagination: response.pagination,
    }
  }
}
