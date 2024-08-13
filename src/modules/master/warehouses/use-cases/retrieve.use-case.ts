import type { IRetrieveOutput } from '@point-hub/papi'

import { IRetrieveWarehouseRepository } from '../repositories/retrieve.repository'

export interface IInput {
  _id: string
}
export interface IDeps {
  retrieveWarehouseRepository: IRetrieveWarehouseRepository
}
export interface IOptions {
  session: unknown
}

export class RetrieveWarehouseUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IRetrieveOutput> {
    // 1. database operation
    const response = await deps.retrieveWarehouseRepository.handle(input._id, options)
    // 2. output
    return {
      _id: response._id,
      branch: response.branch,
      code: response.code,
      name: response.name,
      created_date: response.created_date,
      updated_date: response.updated_date,
    }
  }
}
