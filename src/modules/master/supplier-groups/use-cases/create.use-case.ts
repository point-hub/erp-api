import { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import { IGenerateMasterNumber } from '@/modules/counters/utils/generate-master-number'
import { IAuth } from '@/modules/master/users/interface'

import { collectionName } from '../entity'
import { SupplierGroupEntity } from '../entity'
import { ICreateSupplierGroupRepository } from '../repositories/create.repository'
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
  createSupplierGroupRepository: ICreateSupplierGroupRepository
  generateMasterNumber: IGenerateMasterNumber
  schemaValidation: ISchemaValidation
}

export interface IOutput {
  inserted_id: string
}

export class CreateSupplierGroupUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input.data, createValidation)
    // 2. define entity
    const supplierGroupEntity = new SupplierGroupEntity({
      code: input.data.code,
      name: input.data.name,
      notes: input.data.notes,
      created_by: {
        _id: input.auth._id,
        label: input.auth.name,
        email: input.auth.email,
      },
    })
    supplierGroupEntity.generateDate('created_date')
    supplierGroupEntity.data = deps.objClean(supplierGroupEntity.data)
    // 3. database operation
    // 3.1 create supplier group
    const response = await deps.createSupplierGroupRepository.handle(supplierGroupEntity.data)
    // 3.2. generate counter
    await deps.generateMasterNumber.handle(collectionName, input.data.code)
    // 4. output
    return { inserted_id: response.inserted_id }
  }
}
