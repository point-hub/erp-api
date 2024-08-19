import { IRetrieveItemCategoryRepository } from '../repositories/retrieve.repository'

export interface IInput {
  _id: string
}
export interface IDeps {
  retrieveItemCategoryRepository: IRetrieveItemCategoryRepository
}
export interface IOptions {
  session: unknown
}
export interface IOutput {
  _id: string
  code: string
  name: string
  notes: string
  created_date: Date
  updated_date: Date
}

export class RetrieveItemCategoryUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveItemCategoryRepository.handle(input._id, options)
    // 2. output
    return {
      _id: response._id,
      code: response.code,
      name: response.name,
      notes: response.notes,
      created_date: response.created_date,
      updated_date: response.updated_date,
    }
  }
}
