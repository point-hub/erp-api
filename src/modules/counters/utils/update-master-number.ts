import type { IDatabase } from '@point-hub/papi'

import { RetrieveAllCounterRepository } from '@/modules/counters/repositories/retrieve-all.repository'
import { UpdateCounterRepository } from '@/modules/counters/repositories/update.repository'

export interface IUpdateMasterNumber {
  handle(name: string, code?: string): Promise<void>
}

export class UpdateMasterNumber implements IUpdateMasterNumber {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(name: string, code?: string): Promise<void> {
    const retrieveAllCounterRepository = new RetrieveAllCounterRepository(this.database, this.options)
    const updateCounterRepository = new UpdateCounterRepository(this.database, this.options)
    const counters = await retrieveAllCounterRepository.handle({ filter: { name: name, code: code } })

    // increment form number
    if (counters.data.length > 0) {
      const newCount = Number(counters.data[0].count) + 1
      await updateCounterRepository.handle(counters.data[0]._id, { count: newCount })
    }
  }
}
