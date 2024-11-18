import type { IQuery, IRetrieveAllOutput } from '@point-hub/papi'

import { IRetrieveAllSettingJournalRepository } from '../repositories/retrieve-all.repository'

export interface IInput {
  query: IQuery
}

export interface IDeps {
  retrieveAllSettingJournalRepository: IRetrieveAllSettingJournalRepository
}
export interface IOptions {
  session: unknown
}

export class RetrieveAllSettingJournalUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IRetrieveAllOutput> {
    // 1. database operation
    const response = await deps.retrieveAllSettingJournalRepository.handle(input.query, options)
    // 2. output
    return {
      data: response.data,
      pagination: response.pagination,
    }
  }
}
