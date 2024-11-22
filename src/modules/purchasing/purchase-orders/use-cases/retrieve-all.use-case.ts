import type { IPagination, IQuery } from '@point-hub/papi'

import { IAuth } from '@/modules/master/users/interface'

import { IRetrievePurchaseOrderOutput } from '../repositories/retrieve.repository'
import { IRetrieveAllPurchaseOrderRepository } from '../repositories/retrieve-all.repository'

export interface IInput {
  auth: IAuth
  query: IQuery
}

export interface IDeps {
  retrieveAllPurchaseOrderRepository: IRetrieveAllPurchaseOrderRepository
}

export interface IOutput {
  data: IRetrievePurchaseOrderOutput[]
  pagination: IPagination
}

export class RetrieveAllPurchaseOrderUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveAllPurchaseOrderRepository.handle({ auth: input.auth, query: input.query })
    // 2. output
    return {
      data: response.data,
      pagination: response.pagination,
    }
  }
}
