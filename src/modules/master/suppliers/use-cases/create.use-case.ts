import { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import { IUpdateMasterNumber } from '@/modules/counters/utils/update-master-number'
import { IAuth } from '@/modules/master/users/interface'

import { collectionName, SupplierEntity } from '../entity'
import { ICreateSupplierRepository } from '../repositories/create.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  auth: IAuth
  data: {
    supplier_group: {
      _id: string
      label: string
      code: string
    }
    code: string
    name: string
    address?: string
    phone?: string
    email?: string
    bank_name?: string
    bank_branch?: string
    bank_account_name?: string
    bank_account_number?: string
    notes?: string
  }
}

export interface IDeps {
  objClean: IObjClean
  createSupplierRepository: ICreateSupplierRepository
  updateMasterNumber: IUpdateMasterNumber
  schemaValidation: ISchemaValidation
}

export interface IOutput {
  inserted_id: string
}

export class CreateSupplierUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input.data, createValidation)
    // 2. define entity
    const supplierEntity = new SupplierEntity({
      supplier_group: input.data.supplier_group,
      code: input.data.code,
      name: input.data.name,
      address: input.data.address,
      phone: input.data.phone,
      email: input.data.email,
      bank_name: input.data.bank_name,
      bank_branch: input.data.bank_branch,
      bank_account_name: input.data.bank_account_name,
      bank_account_number: input.data.bank_account_number,
      notes: input.data.notes ?? '',
      created_by: {
        _id: input.auth._id,
        label: input.auth.name,
        email: input.auth.email,
      },
    })
    supplierEntity.generateDate('created_date')
    supplierEntity.data = deps.objClean(supplierEntity.data)
    // 3. database operation
    // 3.1 create supplier
    const response = await deps.createSupplierRepository.handle(supplierEntity.data)
    // 3.2. update counter
    deps.updateMasterNumber.handle(collectionName, input.data.supplier_group.code)
    // 4. output
    return { inserted_id: response.inserted_id }
  }
}
