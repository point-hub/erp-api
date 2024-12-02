import type { IPagination, IQuery } from '@point-hub/papi'

import { IAuth } from '@/modules/master/users/interface'

import { IRetrieveReceiveOrderOutput } from '../repositories/retrieve.repository'
import { IRetrieveAllReceiveOrderRepository } from '../repositories/retrieve-all.repository'

export interface IInput {
  auth: IAuth
  query: IQuery
}

export interface IDeps {
  retrieveAllReceiveOrderRepository: IRetrieveAllReceiveOrderRepository
}

export interface IOutput {
  data: IRetrieveReceiveOrderOutput[]
  pagination: IPagination
}

export class RetrieveAllReceiveOrderUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveAllReceiveOrderRepository.handle({ auth: input.auth, query: input.query })
    // 2. output
    return {
      data: response.data,
      pagination: response.pagination,
    }
  }
}
