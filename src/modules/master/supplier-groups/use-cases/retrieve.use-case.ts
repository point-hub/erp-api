import { IRetrieveSupplierGroupRepository } from '../repositories/retrieve.repository'

export interface IInput {
  _id: string
}

export interface IDeps {
  retrieveSupplierGroupRepository: IRetrieveSupplierGroupRepository
}
export interface IOptions {
  session: unknown
}
export interface IOutput {
  _id: string
  label: string
  code: string
  name: string
  notes: string
  created_date: Date
  updated_date: Date
}

export class RetrieveSupplierGroupUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveSupplierGroupRepository.handle(input._id, options)
    // 2. output
    return {
      _id: response._id,
      label: response.label,
      code: response.code,
      name: response.name,
      notes: response.notes,
      created_date: response.created_date,
      updated_date: response.updated_date,
    }
  }
}
