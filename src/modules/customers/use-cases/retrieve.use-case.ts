import type { IRetrieveOutput } from '@point-hub/papi'

import { IRetrieveCustomerRepository } from '../repositories/retrieve.repository'

export interface IInput {
  _id: string
}
export interface IDeps {
  retrieveCustomerRepository: IRetrieveCustomerRepository
}
export interface IOptions {
  session: unknown
}

export class RetrieveCustomerUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IRetrieveOutput> {
    // 1. database operation
    const response = await deps.retrieveCustomerRepository.handle(input._id, options)
    // 2. output
    return {
      _id: response._id,
      customer_group: response.customer_group,
      code: response.code,
      name: response.name,
      address: response.address,
      phone: response.phone,
      email: response.email,
      notes: response.notes,
      bank_name: response.bank_name,
      bank_branch: response.bank_branch,
      bank_account_name: response.bank_account_name,
      bank_account_number: response.bank_account_number,
      created_date: response.created_date,
      updated_date: response.updated_date,
    }
  }
}
