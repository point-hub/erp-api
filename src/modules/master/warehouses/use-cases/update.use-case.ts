import type { ISchemaValidation } from '@point-hub/papi'

import { IAuth } from '@/modules/master/users/interface'

import { WarehouseEntity } from '../entity'
import { IUpdateWarehouseRepository } from '../repositories/update.repository'
import { updateValidation } from '../validations/update.validation'

export interface IInput {
  auth: IAuth
  _id: string
  data: {
    branch_id?: string
    code?: string
    name?: string
    address?: string
    phone?: string
    notes?: string
    updated_by?: string
  }
}

export interface IDeps {
  schemaValidation: ISchemaValidation
  updateWarehouseRepository: IUpdateWarehouseRepository
}

export interface IOutput {
  matched_count: number
  modified_count: number
}

export class UpdateWarehouseUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input.data, updateValidation)
    // 2. define entity
    const warehouseEntity = new WarehouseEntity({
      branch_id: input.data.branch_id,
      code: input.data.code,
      name: input.data.name,
      address: input.data.address ?? '',
      phone: input.data.phone ?? '',
      notes: input.data.notes ?? '',
      updated_by: input.auth._id,
    })
    warehouseEntity.generateDate('updated_date')
    // 3. database operation
    const response = await deps.updateWarehouseRepository.handle(input._id, warehouseEntity.data)
    // 4. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
