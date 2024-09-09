import type { IPagination, IQuery } from '@point-hub/papi'

import { IRetrieveUserOutput } from '../repositories/retrieve.repository'
import { IRetrieveAuthorizedUsersRepository } from '../repositories/retrieve-authorized-users.repository'

export interface IInput {
  query: IQuery
}
export interface IDeps {
  retrieveAuthorizedUsersRepository: IRetrieveAuthorizedUsersRepository
}
export interface IOptions {
  session: unknown
}
export interface IOutput {
  data: IRetrieveUserOutput[]
  pagination: IPagination
}

export class RetrieveAuthorizedUsersUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveAuthorizedUsersRepository.handle(input.query, options)
    // 2. output
    return {
      data: response.data as IRetrieveUserOutput[],
      pagination: response.pagination,
    }
  }
}
