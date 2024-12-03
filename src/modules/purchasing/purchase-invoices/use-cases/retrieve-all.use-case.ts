import type { IPagination, IQuery } from '@point-hub/papi'

import { IAuth } from '@/modules/master/users/interface'

import { IRetrievePurchaseInvoiceOutput } from '../repositories/retrieve.repository'
import { IRetrieveAllPurchaseInvoiceRepository } from '../repositories/retrieve-all.repository'

export interface IInput {
  auth: IAuth
  query: IQuery
}

export interface IDeps {
  retrieveAllPurchaseInvoiceRepository: IRetrieveAllPurchaseInvoiceRepository
}

export interface IOutput {
  data: IRetrievePurchaseInvoiceOutput[]
  pagination: IPagination
}

export class RetrieveAllPurchaseInvoiceUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveAllPurchaseInvoiceRepository.handle({ auth: input.auth, query: input.query })
    // 2. output
    return {
      data: response.data,
      pagination: response.pagination,
    }
  }
}
