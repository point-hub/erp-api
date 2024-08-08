import type { IPagination, IQuery } from '@point-hub/papi'

import { IRetrievePermissionOutput } from '../repositories/retrieve.repository'
import { IRetrieveAllPermissionRepository } from '../repositories/retrieve-all.repository'

export interface IInput {
  query: IQuery
}
export interface IDeps {
  retrieveAllPermissionRepository: IRetrieveAllPermissionRepository
}
export interface IOptions {
  session: unknown
}
export interface IOutput {
  data: IRetrievePermissionOutput[]
  pagination: IPagination
}

export class RetrieveAllPermissionUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveAllPermissionRepository.handle(input.query, options)
    // 2. output
    return {
      data: response.data,
      pagination: response.pagination,
    }
  }
}
