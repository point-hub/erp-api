import { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import { IRetrieveAllCounterRepository } from '@/modules/counters/repositories/retrieve-all.repository'
import { IUpdateCounterRepository } from '@/modules/counters/repositories/update.repository'
import { IAuth } from '@/modules/master/users/interface'

import { IRetrieveSupplierGroupRepository } from '../../supplier-groups/repositories/retrieve.repository'
import { SupplierEntity } from '../entity'
import { ICreateSupplierRepository } from '../repositories/create.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  auth: IAuth
  data: {
    supplier_group_id?: string
    code?: string
    name?: string
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
  retrieveSupplierGroupRepository: IRetrieveSupplierGroupRepository
  retrieveAllCounterRepository: IRetrieveAllCounterRepository
  updateCounterRepository: IUpdateCounterRepository
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
      supplier_group_id: input.data.supplier_group_id,
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
      created_by: input.auth._id,
    })
    supplierEntity.generateDate('created_date')
    const cleanEntity = deps.objClean(supplierEntity.data)
    // 3. database operation
    // 3.1 create supplier
    const response = await deps.createSupplierRepository.handle(cleanEntity)
    // 3.2. update counter
    const supplierGroup = deps.retrieveSupplierGroupRepository.handle(supplierEntity.data.supplier_group_id as string)
    const counters = await deps.retrieveAllCounterRepository.handle({
      filter: { name: 'supplier_groups', code: (await supplierGroup).code },
    })
    await deps.updateCounterRepository.handle(counters.data[0]._id, { count: Number(counters.data[0].count) + 1 })
    // 4. output
    return { inserted_id: response.inserted_id }
  }
}
