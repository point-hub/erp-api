import type { IQuery, IRetrieveAllOutput, IRetrieveAllRepository } from '@point-hub/papi'
import { query } from 'express'

export interface IInput {
  query: IQuery
}
export interface IDeps {
  retrieveAllRepository: IRetrieveAllRepository
}
export interface IOptions {}

export class RetrieveAllChartOfAccountUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IRetrieveAllOutput> {
    console.log(query)
    const response = await deps.retrieveAllRepository.handle(input.query, options)
    console.log(response)
    return {
      data: response.data,
      pagination: response.pagination,
    }
  }
}
