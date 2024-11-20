import { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import { IUpdateMasterNumber } from '@/modules/counters/utils/update-master-number'
import { IAuth } from '@/modules/master/users/interface'

import { collectionName, WarehouseEntity } from '../entity'
import { ICreateWarehouseRepository } from '../repositories/create.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  auth: IAuth
  data: {
    branch_id: string
    code: string
    name: string
    address?: string
    phone?: string
    notes?: string
  }
}

export interface IDeps {
  objClean: IObjClean
  createWarehouseRepository: ICreateWarehouseRepository
  updateMasterNumber: IUpdateMasterNumber
  schemaValidation: ISchemaValidation
}

export interface IOutput {
  inserted_id: string
}

export class CreateWarehouseUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input.data, createValidation)
    // 2. define entity
    const warehouseEntity = new WarehouseEntity({
      branch_id: input.data.branch_id,
      code: input.data.code,
      name: input.data.name,
      label: `[${input.data.code}] ${input.data.name}`,
      address: input.data.address,
      phone: input.data.phone,
      notes: input.data.notes,
      created_by: {
        _id: input.auth._id,
        label: input.auth.name,
        email: input.auth.email,
      },
    })
    warehouseEntity.generateDate('created_date')
    warehouseEntity.data = deps.objClean(warehouseEntity.data)
    // 3. database operation
    // 3.1 create warehouse
    const response = await deps.createWarehouseRepository.handle(warehouseEntity.data)
    // 3.2. update counter
    await deps.updateMasterNumber.handle(collectionName)
    // 4. output
    return { inserted_id: response.inserted_id }
  }
}
