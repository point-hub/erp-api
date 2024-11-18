import type { IPagination, IQuery } from '@point-hub/papi'

import { IAuth } from '@/modules/master/users/interface'

import { IRetrievePurchaseRequestOutput } from '../repositories/retrieve.repository'
import { IRetrieveAllPurchaseRequestRepository } from '../repositories/retrieve-all.repository'

export interface IInput {
  auth: IAuth
  query: IQuery
}

export interface IDeps {
  retrieveAllPurchaseRequestRepository: IRetrieveAllPurchaseRequestRepository
}
export interface IOptions {
  session: unknown
}
export interface IOutput {
  data: IRetrievePurchaseRequestOutput[]
  pagination: IPagination
}

export class RetrieveAllPurchaseRequestUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveAllPurchaseRequestRepository.handle(
      { auth: input.auth, query: input.query },
      options,
    )
    // 2. output
    return {
      data: response.data,
      pagination: response.pagination,
    }
  }
}
