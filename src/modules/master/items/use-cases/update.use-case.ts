import type { ISchemaValidation, IUpdateOutput } from '@point-hub/papi'

import { ItemEntity } from '../entity'
import { IUpdateItemRepository } from '../repositories/update.repository'
import { updateValidation } from '../validations/update.validation'

export interface IInput {
  _id: string
  data: {
    category_id?: string
    chart_of_account_id?: string
    code?: string
    name?: string
    unit?: string
    have_production_number?: boolean
    have_an_expiry_date?: boolean
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
      category_id: input.data.category_id,
      chart_of_account_id: input.data.chart_of_account_id,
      code: input.data.code,
      name: input.data.name,
      unit: input.data.unit,
      have_production_number: input.data.have_production_number,
      have_an_expiry_date: input.data.have_an_expiry_date,
    })
    itemEntity.generateUpdatedDate()
    // 3. database operation
    const response = await deps.updateItemRepository.handle(input._id, itemEntity.data, options)
    // 4. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
