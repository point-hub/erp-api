import { IRetrieveWarehouseRepository } from '../repositories/retrieve.repository'

export interface IInput {
  _id: string
}
export interface IDeps {
  retrieveWarehouseRepository: IRetrieveWarehouseRepository
}
export interface IOptions {
  session: unknown
}
export interface IOutput {
  _id: string
  branch: {
    _id: string
    code: string
    name: string
  }
  code: string
  name: string
  address: string
  phone: string
  notes: string
  created_date: string
  updated_date: string
}

export class RetrieveWarehouseUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveWarehouseRepository.handle(input._id, options)
    // 2. output
    return {
      _id: response._id,
      branch: response.branch,
      code: response.code,
      name: response.name,
      address: response.address,
      phone: response.phone,
      notes: response.notes,
      created_date: response.created_date,
      updated_date: response.updated_date,
    }
  }
}
