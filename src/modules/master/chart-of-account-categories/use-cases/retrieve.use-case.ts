import { IRetrieveChartOfAccountCategoryRepository } from '../repositories/retrieve.repository'

export interface IInput {
  _id: string
}

export interface IDeps {
  retrieveChartOfAccountCategoryRepository: IRetrieveChartOfAccountCategoryRepository
}
export interface IOptions {
  session: unknown
}
export interface IOutput {
  _id: string
  name: string
  type: {
    _id: string
    name: string
  }
  created_date: Date
  updated_date: Date
}

export class RetrieveChartOfAccountCategoryUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveChartOfAccountCategoryRepository.handle(input._id, options)
    // 2. output
    return {
      _id: response._id,
      name: response.name,
      type: response.type,
      created_date: response.created_date,
      updated_date: response.updated_date,
    }
  }
}
