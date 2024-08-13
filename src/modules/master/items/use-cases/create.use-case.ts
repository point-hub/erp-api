import type { ICreateOutput, ISchemaValidation } from '@point-hub/papi'

import { IRetrieveAllCounterRepository } from '@/modules/counters/repositories/retrieve-all.repository'
import { IUpdateCounterRepository } from '@/modules/counters/repositories/update.repository'

import { ItemEntity } from '../entity'
import { ICreateItemRepository } from '../repositories/create.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  category_id?: string
  chart_of_account_id?: string
  code?: string
  name?: string
  unit?: string
  have_production_number?: boolean
  have_an_expiry_date?: boolean
}
export interface IDeps {
  cleanObject(object: object): object
  createItemRepository: ICreateItemRepository
  retrieveAllCounterRepository: IRetrieveAllCounterRepository
  updateCounterRepository: IUpdateCounterRepository
  schemaValidation: ISchemaValidation
}
export interface IOptions {
  session?: unknown
}

export class CreateItemUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<ICreateOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, createValidation)
    // 2. define entity
    const exampleEntity = new ItemEntity({
      category_id: input.category_id,
      chart_of_account_id: input.chart_of_account_id,
      code: input.code,
      name: input.name,
      unit: input.unit,
      have_production_number: input.have_production_number,
      have_an_expiry_date: input.have_an_expiry_date,
    })
    exampleEntity.generateCreatedDate()
    const cleanEntity = deps.cleanObject(exampleEntity.data)
    // 3. database operation
    // 3.1 create item
    const response = await deps.createItemRepository.handle(cleanEntity, options)
    // 3.2. update code counter
    const counters = await deps.retrieveAllCounterRepository.handle({ filter: { name: 'items', code: '' } }, options)
    await deps.updateCounterRepository.handle(
      counters.data[0]._id,
      { count: Number(counters.data[0].count) + 1 },
      options,
    )
    // 4. response
    return { inserted_id: response.inserted_id }
  }
}
