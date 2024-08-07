import type { IQuery } from '@point-hub/papi'

import {
  IRetrieveAllCustomerGroupOutput,
  IRetrieveAllCustomerGroupRepository,
} from '../repositories/retrieve-all.repository'

export interface IInput {
  query: IQuery
}
export interface IDeps {
  retrieveAllRepository: IRetrieveAllCustomerGroupRepository
}
export interface IOptions {
  session: unknown
}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IOutput extends IRetrieveAllCustomerGroupOutput {}

export class RetrieveAllCustomerGroupUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    const response = await deps.retrieveAllRepository.handle(input.query, options)

    return {
      data: response.data,
      pagination: response.pagination,
    }
  }
}
