import { IRetrieveCustomerGroupRepository } from '../repositories/retrieve.repository'

export interface IInput {
  _id: string
}
export interface IDeps {
  retrieveCustomerGroupRepository: IRetrieveCustomerGroupRepository
}
export interface IOptions {
  session: unknown
}
export interface IOutput {
  _id: string
  code: string
  name: string
  created_date: string
  updated_date: string
}

export class RetrieveCustomerGroupUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveCustomerGroupRepository.handle(input._id, options)
    // 2. output
    return {
      _id: response._id,
      code: response.code,
      name: response.name,
      created_date: response.created_date,
      updated_date: response.updated_date,
    }
  }
}
