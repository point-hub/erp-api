import { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import { IGenerateMasterNumber } from '@/modules/counters/utils/generate-master-number'
import { IAuth } from '@/modules/master/users/interface'

import { collectionName, ItemCategoryEntity } from '../entity'
import { ICreateItemCategoryRepository } from '../repositories/create.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  auth: IAuth
  data: {
    code: string
    name: string
    notes?: string
  }
}

export interface IDeps {
  objClean: IObjClean
  createItemCategoryRepository: ICreateItemCategoryRepository
  generateMasterNumber: IGenerateMasterNumber
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
      created_by: {
        _id: input.auth._id,
        label: input.auth.name,
        email: input.auth.email,
      },
    })
    itemCategoryEntity.generateDate('created_date')
    itemCategoryEntity.data = deps.objClean(itemCategoryEntity.data)
    // 3. database operation
    // 3.1 create item category
    const response = await deps.createItemCategoryRepository.handle(itemCategoryEntity.data)
    // 3.2. update counter
    await deps.generateMasterNumber.handle(collectionName, input.data.code)
    // 4. output
    return { inserted_id: response.inserted_id }
  }
}
