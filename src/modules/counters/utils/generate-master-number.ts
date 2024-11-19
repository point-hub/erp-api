import type { IDatabase } from '@point-hub/papi'

import { CreateCounterRepository } from '@/modules/counters/repositories/create.repository'
import { RetrieveAllCounterRepository } from '@/modules/counters/repositories/retrieve-all.repository'
import { throwApiError } from '@/utils/throw-api-error'

export interface IGenerateMasterNumber {
  handle(name: string, code: string): Promise<void>
}

export class GenerateMasterNumber implements IGenerateMasterNumber {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(name: string, code: string): Promise<void> {
    const createCounterRepository = new CreateCounterRepository(this.database, this.options)
    const retrieveAllCounterRepository = new RetrieveAllCounterRepository(this.database, this.options)

    const counters = await retrieveAllCounterRepository.handle({ filter: { name: name, code: code } })

    if (counters.data.length > 0) {
      throwApiError(422, {
        errors: {
          code: 'The code already exists in database counters',
        },
      })
    }

    await createCounterRepository.handle({
      name: name,
      code: code,
      count: 0,
    })
  }
}
