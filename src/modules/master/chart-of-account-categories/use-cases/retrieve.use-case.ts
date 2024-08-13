import type { IRetrieveOutput } from '@point-hub/papi'

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

export class RetrieveChartOfAccountCategoryUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IRetrieveOutput> {
    // 1. database operation
    const response = await deps.retrieveChartOfAccountCategoryRepository.handle(input._id, options)
    // 2. output
    return {
      _id: response._id,
      name: response.name,
      created_date: response.created_date,
      updated_date: response.updated_date,
    }
  }
}
