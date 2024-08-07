import type { ISchemaValidation } from '@point-hub/papi'

import { ItemCategoryEntity } from '../entity'
import { ICreateItemCategoryRepository } from '../repositories/create.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  code?: string
  name?: string
}
export interface IDeps {
  cleanObject(object: object): object
  createItemCategoryRepository: ICreateItemCategoryRepository
  schemaValidation: ISchemaValidation
}
export interface IOptions {
  session?: unknown
}
export interface IOutput {
  inserted_id: string
}

export class CreateItemCategoryUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, createValidation)
    // 2. define entity
    const itemCategoryEntity = new ItemCategoryEntity({
      code: input.code,
      name: input.name,
    })
    itemCategoryEntity.generateCreatedDate()
    const cleanEntity = deps.cleanObject(itemCategoryEntity.data)
    // 3. database operation
    const response = await deps.createItemCategoryRepository.handle(cleanEntity, options)
    // 4. output
    return { inserted_id: response.inserted_id }
  }
}
