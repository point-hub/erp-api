import { IRetrieveSupplierRepository } from '../repositories/retrieve.repository'

export interface IInput {
  _id: string
}
export interface IDeps {
  retrieveSupplierRepository: IRetrieveSupplierRepository
}
export interface IOptions {
  session: unknown
}
export interface IOutput {
  _id: string
  supplier_group: {
    _id: string
    label: string
    code: string
    name: string
  }
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

export class RetrieveSupplierUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveSupplierRepository.handle(input._id, options)
    // 2. output
    return {
      _id: response._id,
      supplier_group: response.supplier_group,
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
