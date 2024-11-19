import { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import { ICreateCounterRepository } from '@/modules/counters/repositories/create.repository'
import { IRetrieveAllCounterRepository } from '@/modules/counters/repositories/retrieve-all.repository'
import { IAuth } from '@/modules/master/users/interface'

import { ItemCategoryEntity } from '../entity'
import { ICreateItemCategoryRepository } from '../repositories/create.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  auth: IAuth
  data: {
    code?: string
    name?: string
    notes?: string
  }
}

export interface IDeps {
  objClean: IObjClean
  createItemCategoryRepository: ICreateItemCategoryRepository
  retrieveAllCounterRepository: IRetrieveAllCounterRepository
  createCounterRepository: ICreateCounterRepository
  schemaValidation: ISchemaValidation
}

export interface IOutput {
  inserted_id: string
}

export class CreateItemCategoryUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input.data, createValidation)
    // 2. define entity
    const itemCategoryEntity = new ItemCategoryEntity({
      code: input.data.code,
      name: input.data.name,
      notes: input.data.notes,
      created_by: input.auth._id,
    })
    itemCategoryEntity.generateDate('created_date')
    itemCategoryEntity.data = deps.objClean(itemCategoryEntity.data)
    // 3. database operation
    // 3.1 create item category
    const response = await deps.createItemCategoryRepository.handle(itemCategoryEntity.data)
    // 3.2. update counter
    const counters = await deps.retrieveAllCounterRepository.handle({
      filter: { name: 'item_categories', code: input.data.code },
    })
    if (!counters.data.length) {
      await deps.createCounterRepository.handle({
        name: 'item_categories',
        code: input.data.code,
        count: 0,
      })
    }
    // 4. output
    return { inserted_id: response.inserted_id }
  }
}
