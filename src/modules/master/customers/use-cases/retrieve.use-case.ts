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
export interface IOutput {
  _id: string
  customer_group: {
    _id: string
    label: string
    code: string
    name: string
  }
  label: string
  code: string
  name: string
  address: string
  phone: string
  email: string
  bank_name: string
  bank_branch: string
  bank_account_name: string
  bank_account_number: string
  notes: string
  created_date: Date
  updated_date: Date
}

export class RetrieveCustomerUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveCustomerRepository.handle(input._id, options)
    // 2. output
    return {
      _id: response._id,
      customer_group: response.customer_group,
      label: response.label,
      code: response.code,
      name: response.name,
      address: response.address,
      phone: response.phone,
      email: response.email,
      bank_name: response.bank_name,
      bank_branch: response.bank_branch,
      bank_account_name: response.bank_account_name,
      bank_account_number: response.bank_account_number,
      notes: response.notes,
      created_date: response.created_date,
      updated_date: response.updated_date,
    }
  }
}
