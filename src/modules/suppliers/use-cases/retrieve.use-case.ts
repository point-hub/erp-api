import type { IRetrieveOutput } from '@point-hub/papi'

import { IRetrieveSupplierRepository } from '../repositories/retrieve.repository'

export interface IInput {
  _id: string
}
export interface IDeps {
  retrieveSupplierRepository: IRetrieveSupplierRepository
}
export interface IOptions {
  session: unknown
}

export class RetrieveSupplierUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IRetrieveOutput> {
    // 1. database operation
    const response = await deps.retrieveSupplierRepository.handle(input._id, options)
    // 2. output
    return {
      _id: response._id,
      supplier_group: response.supplier_group,
      code: response.code,
      name: response.name,
      created_date: response.created_date,
      updated_date: response.updated_date,
    }
  }
}
