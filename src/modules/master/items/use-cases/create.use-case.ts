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
    code?: string
    name?: string
    address?: string
    phone?: string
    email?: string
    bank_name?: string
    bank_branch?: string
    bank_account_name?: string
    bank_account_number?: string
    notes?: string
  }
}
export interface IDeps {
  cleanObject(object: object): object
  createItemRepository: ICreateItemRepository
  retrieveItemCategoryRepository: IRetrieveItemCategoryRepository
  retrieveAllCounterRepository: IRetrieveAllCounterRepository
  updateCounterRepository: IUpdateCounterRepository
  schemaValidation: ISchemaValidation
}
export interface IOptions {
  session?: unknown
}
export interface IOutput {
  inserted_id: string
}

export class CreateItemUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input.data, createValidation)
    // 2. define entity
    const itemEntity = new ItemEntity({
      category_id: input.data.category_id,
      code: input.data.code,
      name: input.data.name,
      address: input.data.address,
      phone: input.data.phone,
      email: input.data.email,
      bank_name: input.data.bank_name,
      bank_branch: input.data.bank_branch,
      bank_account_name: input.data.bank_account_name,
      bank_account_number: input.data.bank_account_number,
      notes: input.data.notes ?? '',
      created_by: input.auth._id,
    })
    itemEntity.generateCreatedDate()
    const cleanEntity = deps.cleanObject(itemEntity.data)
    // 3. database operation
    // 3.1 create item
    const response = await deps.createItemRepository.handle(cleanEntity, options)
    // 3.2. update counter
    const itemCategory = deps.retrieveItemCategoryRepository.handle(itemEntity.data.category_id as string, options)
    const counters = await deps.retrieveAllCounterRepository.handle(
      { filter: { name: 'item_categories', code: (await itemCategory).code } },
      options,
    )
    await deps.updateCounterRepository.handle(
      counters.data[0]._id,
      { count: Number(counters.data[0].count) + 1 },
      options,
    )
    // 4. output
    return { inserted_id: response.inserted_id }
  }
}
