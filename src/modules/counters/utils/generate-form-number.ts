import type { IDatabase } from '@point-hub/papi'
import { format } from 'date-fns'

import { CreateCounterRepository } from '@/modules/counters/repositories/create.repository'
import { RetrieveAllCounterRepository } from '@/modules/counters/repositories/retrieve-all.repository'
import { UpdateCounterRepository } from '@/modules/counters/repositories/update.repository'

export interface IGenerateFormNumber {
  handle(prefix: string, filterName: string, options: unknown): Promise<string>
}

export class GenerateFormNumber implements IGenerateFormNumber {
  constructor(public database: IDatabase) {}

  async handle(prefix: string, filterName: string, options: unknown): Promise<string> {
    const createCounterRepository = new CreateCounterRepository(this.database)
    const retrieveAllCounterRepository = new RetrieveAllCounterRepository(this.database)
    const updateCounterRepository = new UpdateCounterRepository(this.database)

    const code = prefix + format(new Date(), 'yyMM')
    const counters = await retrieveAllCounterRepository.handle({ filter: { name: filterName, code: code } }, options)

    let formNumber = code

    if (!counters.data.length) {
      // generate first form number
      await createCounterRepository.handle(
        {
          name: 'purchasing.purchase_requests',
          code: code,
          count: 1,
        },
        options,
      )
      formNumber += '0001'
    } else {
      // increment form number
      formNumber += (Number(counters.data[0].count) + 1).toString().padStart(4, '0')
      await updateCounterRepository.handle(counters.data[0]._id, { count: Number(counters.data[0].count) + 1 }, options)
    }

    return formNumber
  }
}
