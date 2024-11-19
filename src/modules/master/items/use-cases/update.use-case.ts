import type { ISchemaValidation } from '@point-hub/papi'

import { IAuth } from '@/modules/master/users/interface'

import { ItemEntity } from '../entity'
import { IUpdateItemRepository } from '../repositories/update.repository'
import { updateValidation } from '../validations/update.validation'

export interface IInput {
  auth: IAuth
  _id: string
  data: {
    category?: {
      _id?: string
      label?: string
      code?: string
    }
    chart_of_account_id?: string
    code?: string
    name?: string
    unit?: string
    have_production_number?: boolean
    have_an_expiry_date?: boolean
    notes?: string
    updated_by: {
      _id: string
      label: string
      email: string
    }
  }
}

export interface IDeps {
  schemaValidation: ISchemaValidation
  updateItemRepository: IUpdateItemRepository
}

export interface IOutput {
  matched_count: number
  modified_count: number
}

export class UpdateItemUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input.data, updateValidation)
    // 2. define entity
    const itemEntity = new ItemEntity({
      category: input.data.category,
      chart_of_account_id: input.data.chart_of_account_id,
      code: input.data.code,
      name: input.data.name,
      unit: input.data.unit,
      have_production_number: input.data.have_production_number,
      have_an_expiry_date: input.data.have_an_expiry_date,
      notes: input.data.notes ?? '',
      updated_by: {
        _id: input.auth._id,
        label: input.auth.name,
        email: input.auth.email,
      },
    })
    itemEntity.generateDate('updated_date')
    // 3. database operation
    const response = await deps.updateItemRepository.handle(input._id, itemEntity.data)
    // 4. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
