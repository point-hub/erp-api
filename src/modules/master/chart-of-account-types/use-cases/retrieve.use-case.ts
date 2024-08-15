import { IRetrieveChartOfAccountTypeRepository } from '../repositories/retrieve.repository'

export interface IInput {
  _id: string
}
export interface IDeps {
  retrieveChartOfAccountTypeRepository: IRetrieveChartOfAccountTypeRepository
}
export interface IOptions {
  session: unknown
}
export interface IOutput {
  _id: string
  name: string
  created_date: Date
  updated_date: Date
}

export class RetrieveChartOfAccountTypeUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveChartOfAccountTypeRepository.handle(input._id, options)
    // 2. output
    return {
      _id: response._id,
      name: response.name,
      created_date: response.created_date,
      updated_date: response.updated_date,
    }
  }
}
