import { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import { IRetrieveAllCounterRepository } from '@/modules/counters/repositories/retrieve-all.repository'
import { IUpdateCounterRepository } from '@/modules/counters/repositories/update.repository'
import { IAuth } from '@/modules/master/users/interface'

import { IRetrieveItemCategoryRepository } from '../../item-categories/repositories/retrieve.repository'
import { ItemEntity } from '../entity'
import { ICreateItemRepository } from '../repositories/create.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  auth: IAuth
  data: {
    category_id?: string
    chart_of_account_id?: string
    code?: string
    name?: string
    unit?: string
    have_production_number?: boolean
    have_an_expiry_date?: boolean
    notes?: string
  }
}

export interface IDeps {
  objClean: IObjClean
  createItemRepository: ICreateItemRepository
  retrieveItemCategoryRepository: IRetrieveItemCategoryRepository
  retrieveAllCounterRepository: IRetrieveAllCounterRepository
  updateCounterRepository: IUpdateCounterRepository
  schemaValidation: ISchemaValidation
}

export interface IOutput {
  inserted_id: string
}

export class CreateItemUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input.data, createValidation)
    // 2. define entity
    const itemEntity = new ItemEntity({
      category_id: input.data.category_id,
      chart_of_account_id: input.data.chart_of_account_id,
      code: input.data.code,
      name: input.data.name,
      unit: input.data.unit,
      have_production_number: input.data.have_production_number,
      have_an_expiry_date: input.data.have_an_expiry_date,
      notes: input.data.notes ?? '',
      created_by: {
        _id: input.auth._id,
        label: input.auth.name,
        email: input.auth.email,
      },
    })
    itemEntity.generateDate('created_date')
    const cleanEntity = deps.objClean(itemEntity.data)
    // 3. database operation
    // 3.1 create item
    const response = await deps.createItemRepository.handle(cleanEntity)
    // 3.2. update counter
    const itemCategory = deps.retrieveItemCategoryRepository.handle(itemEntity.data.category_id as string)
    const counters = await deps.retrieveAllCounterRepository.handle({
      filter: { name: 'item_categories', code: (await itemCategory).code },
    })
    await deps.updateCounterRepository.handle(counters.data[0]._id, { count: Number(counters.data[0].count) + 1 })
    // 4. output
    return { inserted_id: response.inserted_id }
  }
}
