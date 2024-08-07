import { IRetrieveBranchRepository } from '../repositories/retrieve.repository'

export interface IInput {
  _id: string
}
export interface IDeps {
  retrieveBranchRepository: IRetrieveBranchRepository
}
export interface IOptions {
  session: unknown
}
export interface IOutput {
  _id: string
  code: string
  name: string
  address: string
  phone: string
  created_date: string
  updated_date: string
}

export class RetrieveBranchUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveBranchRepository.handle(input._id, options)
    // 2. output
    return {
      _id: response._id,
      code: response.code,
      name: response.name,
      address: response.address,
      phone: response.phone,
      created_date: response.created_date,
      updated_date: response.updated_date,
    }
  }
}
