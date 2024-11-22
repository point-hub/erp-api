import type { IPagination, IQuery } from '@point-hub/papi'

import { IRetrieveMachineOutput } from '../repositories/retrieve.repository'
import { IRetrieveAllMachineRepository } from '../repositories/retrieve-all.repository'

export interface IInput {
  query: IQuery
}

export interface IDeps {
  retrieveAllMachineRepository: IRetrieveAllMachineRepository
}

export interface IOutput {
  data: IRetrieveMachineOutput[]
  pagination: IPagination
}

export class RetrieveAllMachineUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveAllMachineRepository.handle(input.query)
    // 2. output
    return {
      data: response.data,
      pagination: response.pagination,
    }
  }
}
