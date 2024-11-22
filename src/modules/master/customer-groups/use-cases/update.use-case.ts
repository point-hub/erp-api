import type { ISchemaValidation } from '@point-hub/papi'

import { IAuth } from '@/modules/master/users/interface'

import { CustomerGroupEntity } from '../entity'
import { IUpdateCustomerGroupRepository } from '../repositories/update.repository'
import { updateValidation } from '../validations/update.validation'

export interface IInput {
  auth: IAuth
  _id: string
  data: {
    code?: string
    name?: string
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
  updateCustomerGroupRepository: IUpdateCustomerGroupRepository
}

export interface IOutput {
  matched_count: number
  modified_count: number
}

export class UpdateCustomerGroupUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input.data, updateValidation)
    // 2. define entity
    const customerGroupEntity = new CustomerGroupEntity({
      code: input.data.code,
      name: input.data.name,
      notes: input.data.notes ?? '',
      updated_by: {
        _id: input.auth._id,
        label: input.auth.name,
        email: input.auth.email,
      },
    })
    customerGroupEntity.generateDate('updated_date')
    // 3. database operation
    const response = await deps.updateCustomerGroupRepository.handle(input._id, customerGroupEntity.data)
    // 4. output
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
