import { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import { IUpdateMasterNumber } from '@/modules/counters/utils/update-master-number'
import { IAuth } from '@/modules/master/users/interface'

import { collectionName, ItemEntity } from '../entity'
import { ICreateItemRepository } from '../repositories/create.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  auth: IAuth
  data: {
    category: {
      _id: string
      label: string
      code: string
    }
    chart_of_account: {
      _id: string
      label: string
      number: string
      name: string
    }
    code: string
    name: string
    unit: string
    have_production_number?: boolean
    have_an_expiry_date?: boolean
    notes?: string
  }
}

export interface IDeps {
  objClean: IObjClean
  createItemRepository: ICreateItemRepository
  updateMasterNumber: IUpdateMasterNumber
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
      category: input.data.category,
      chart_of_account: input.data.chart_of_account,
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
    itemEntity.data = deps.objClean(itemEntity.data)
    // 3. database operation
    // 3.1 create item
    const response = await deps.createItemRepository.handle(itemEntity.data)
    // 3.2. update counter
    await deps.updateMasterNumber.handle(collectionName, input.data.category.code)
    // 4. output
    return { inserted_id: response.inserted_id }
  }
}
