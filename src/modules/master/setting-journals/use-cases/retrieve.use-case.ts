import type { IRetrieveOutput } from '@point-hub/papi'

import { IRetrieveSettingJournalRepository } from '../repositories/retrieve.repository'

export interface IInput {
  _id: string
}

export interface IDeps {
  retrieveSettingJournalRepository: IRetrieveSettingJournalRepository
}
export interface IOptions {
  session: unknown
}

export class RetrieveSettingJournalUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IRetrieveOutput> {
    // 1. database operation
    const response = await deps.retrieveSettingJournalRepository.handle(input._id, options)
    // 2. output
    return {
      _id: response._id,
      module: response.module,
      feature: response.feature,
      journals: response.journals,
      created_date: response.created_date,
      updated_date: response.updated_date,
    }
  }
}
