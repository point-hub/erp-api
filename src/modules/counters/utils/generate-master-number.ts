import type { IDatabase } from '@point-hub/papi'

import { CreateCounterRepository } from '@/modules/counters/repositories/create.repository'
import { RetrieveAllCounterRepository } from '@/modules/counters/repositories/retrieve-all.repository'
import { UpdateCounterRepository } from '@/modules/counters/repositories/update.repository'

export interface IGenerateMasterNumber {
  handle(prefix: string, name: string): Promise<string>
}

export class GenerateMasterNumber implements IGenerateMasterNumber {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(prefix: string, name: string): Promise<string> {
    const createCounterRepository = new CreateCounterRepository(this.database)
    const retrieveAllCounterRepository = new RetrieveAllCounterRepository(this.database)
    const updateCounterRepository = new UpdateCounterRepository(this.database)

    const code = prefix
    const counters = await retrieveAllCounterRepository.handle({ filter: { name: name, code: code } }, this.options)

    let masterNumber = code

    if (!counters.data.length) {
      // generate first form number
      await createCounterRepository.handle(
        {
          name: name,
          code: code,
          count: 1,
        },
        this.options,
      )
      masterNumber += '0001'
    } else {
      // increment form number
      const newCount = Number(counters.data[0].count) + 1
      masterNumber += newCount.toString().padStart(4, '0')
      await updateCounterRepository.handle(counters.data[0]._id, { count: newCount }, this.options)
    }

    return masterNumber
  }
}
