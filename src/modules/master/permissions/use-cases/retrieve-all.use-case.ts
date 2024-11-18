import type { IQuery } from '@point-hub/papi'

import { IRetrieveAllPermissionRepository } from '../repositories/retrieve-all.repository'

export interface INestedBoolean {
  [key: string]: boolean | { [key: string]: boolean }
}

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
  master: INestedBoolean
  purchasing: INestedBoolean
  sales: INestedBoolean
  finance: INestedBoolean
  manufacture: INestedBoolean
  inventory: INestedBoolean
  accounting: INestedBoolean
}

export class RetrieveAllPermissionUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveAllPermissionRepository.handle(input.query, options)
    // 2. output
    return response
  }
}
