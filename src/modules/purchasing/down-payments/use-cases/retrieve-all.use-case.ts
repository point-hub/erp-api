import type { IPagination, IQuery } from '@point-hub/papi'

import { IAuth } from '@/modules/master/users/interface'

import { IRetrieveDownPaymentOutput } from '../repositories/retrieve.repository'
import { IRetrieveAllDownPaymentRepository } from '../repositories/retrieve-all.repository'

export interface IInput {
  auth: IAuth
  query: IQuery
}

export interface IDeps {
  retrieveAllDownPaymentRepository: IRetrieveAllDownPaymentRepository
}

export interface IOutput {
  data: IRetrieveDownPaymentOutput[]
  pagination: IPagination
}

export class RetrieveAllDownPaymentUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveAllDownPaymentRepository.handle({ auth: input.auth, query: input.query })
    // 2. output
    return {
      data: response.data,
      pagination: response.pagination,
    }
  }
}
