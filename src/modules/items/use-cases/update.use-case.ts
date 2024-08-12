import type { ISchemaValidation, IUpdateOutput } from '@point-hub/papi'

import { ItemEntity } from '../entity'
import { IUpdateItemRepository } from '../repositories/update.repository'
import { updateValidation } from '../validations/update.validation'

export interface IInput {
  _id: string
  data: {
    branch_id?: string
    code?: string
    name?: string
  }
}
export interface IDeps {
  cleanObject(object: object): object
  schemaValidation: ISchemaValidation
  updateItemRepository: IUpdateItemRepository
}
export interface IOptions {
  session?: unknown
}

export class UpdateItemUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IUpdateOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, updateValidation)
    // 2. define entity
    const itemEntity = new ItemEntity({
      branch_id: input.data.branch_id,
      code: input.data.code,
      name: input.data.name,
    })
    itemEntity.generateUpdatedDate()
    // 3. database operation
    const response = await deps.updateItemRepository.handle(input._id, itemEntity.data, options)
    // 4. response
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
