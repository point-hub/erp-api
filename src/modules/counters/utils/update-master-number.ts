import type { IDatabase } from '@point-hub/papi'

import { RetrieveAllCounterRepository } from '@/modules/counters/repositories/retrieve-all.repository'
import { UpdateCounterRepository } from '@/modules/counters/repositories/update.repository'

export interface IUpdateMasterNumber {
  handle(prefix: string, name: string): Promise<string>
}

export class UpdateMasterNumber implements IUpdateMasterNumber {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(prefix: string, name: string): Promise<string> {
    const retrieveAllCounterRepository = new RetrieveAllCounterRepository(this.database, this.options)
    const updateCounterRepository = new UpdateCounterRepository(this.database, this.options)

    const code = prefix
    const counters = await retrieveAllCounterRepository.handle({ filter: { name: name, code: code } })

    let masterNumber = code

    // increment form number
    const newCount = Number(counters.data[0].count) + 1
    masterNumber += newCount.toString().padStart(4, '0')
    await updateCounterRepository.handle(counters.data[0]._id, { count: newCount })

    return masterNumber
  }
}
