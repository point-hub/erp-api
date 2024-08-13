import type { IRetrieveOutput } from '@point-hub/papi'

import { IRetrieveItemRepository } from '../repositories/retrieve.repository'

export interface IInput {
  _id: string
}
export interface IDeps {
  retrieveItemRepository: IRetrieveItemRepository
}
export interface IOptions {
  session: unknown
}

export class RetrieveItemUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IRetrieveOutput> {
    // 1. database operation
    const response = await deps.retrieveItemRepository.handle(input._id, options)
    // 2. output
    return {
      _id: response._id,
      chart_of_account: response.chart_of_account,
      category: response.category,
      code: response.code,
      name: response.name,
      unit: response.unit,
      have_production_number: response.have_production_number,
      have_an_expiry_date: response.have_an_expiry_date,
      created_date: response.created_date,
      updated_date: response.updated_date,
    }
  }
}
