import type { IDatabase } from '@point-hub/papi'
import { format } from 'date-fns'

import { CreateCounterRepository } from '@/modules/counters/repositories/create.repository'
import { RetrieveAllCounterRepository } from '@/modules/counters/repositories/retrieve-all.repository'
import { UpdateCounterRepository } from '@/modules/counters/repositories/update.repository'

export interface IGenerateFormNumber {
  handle(prefix: string, name: string): Promise<string>
}

export class GenerateFormNumber implements IGenerateFormNumber {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(prefix: string, name: string): Promise<string> {
    const createCounterRepository = new CreateCounterRepository(this.database, this.options)
    const retrieveAllCounterRepository = new RetrieveAllCounterRepository(this.database, this.options)
    const updateCounterRepository = new UpdateCounterRepository(this.database, this.options)

    const code = prefix + format(new Date(), 'yyMM')
    const counters = await retrieveAllCounterRepository.handle({ filter: { name: name, code: code } })

    let formNumber = code

    if (!counters.data.length) {
      // generate first form number
      await createCounterRepository.handle({
        name: name,
        code: code,
        count: 1,
      })
      formNumber += '0001'
    } else {
      // increment form number
      formNumber += (Number(counters.data[0].count) + 1).toString().padStart(4, '0')
      await updateCounterRepository.handle(counters.data[0]._id, { count: Number(counters.data[0].count) + 1 })
    }

    return formNumber
  }
}
