import { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import { IUpdateMasterNumber } from '@/modules/counters/utils/update-master-number'
import { IAuth } from '@/modules/master/users/interface'

import { collectionName, RoleEntity } from '../entity'
import { ICreateRoleRepository } from '../repositories/create.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  auth: IAuth
  data: {
    code: string
    name: string
    permission?: { [key: string]: boolean | { [key: string]: boolean } }
    phone?: string
    notes?: string
  }
}

export interface IDeps {
  objClean: IObjClean
  createRoleRepository: ICreateRoleRepository
  updateMasterNumber: IUpdateMasterNumber
  schemaValidation: ISchemaValidation
}

export interface IOutput {
  inserted_id: string
}

export class CreateRoleUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input.data, createValidation)
    // 2. define entity
    const roleEntity = new RoleEntity({
      code: input.data.code,
      name: input.data.name,
      permission: input.data.permission,
      notes: input.data.notes,
      created_by: {
        _id: input.auth._id,
        label: input.auth.name,
        email: input.auth.email,
      },
    })
    roleEntity.generateDate('created_date')
    const cleanEntity = deps.objClean(roleEntity.data)
    // 3. database operation
    // 3.1 create role
    const response = await deps.createRoleRepository.handle(cleanEntity)
    // 3.2. update counter
    await deps.updateMasterNumber.handle(collectionName, input.data.code)
    // 4. output
    return { inserted_id: response.inserted_id }
  }
}
