import { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import { IUpdateMasterNumber } from '@/modules/counters/utils/update-master-number'
import { IAuth } from '@/modules/master/users/interface'

import { collectionName, CustomerEntity } from '../entity'
import { ICreateCustomerRepository } from '../repositories/create.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  auth: IAuth
  data: {
    customer_group: {
      _id: string
      label: string
      code: string
      name: string
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
  createCustomerRepository: ICreateCustomerRepository
  updateMasterNumber: IUpdateMasterNumber
  schemaValidation: ISchemaValidation
}

export interface IOutput {
  inserted_id: string
}

export class CreateCustomerUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input.data, createValidation)
    // 2. define entity
    const customerEntity = new CustomerEntity({
      customer_group: input.data.customer_group,
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
    customerEntity.generateDate('created_date')
    customerEntity.data = deps.objClean(customerEntity.data)
    // 3. database operation
    // 3.1 create customer
    const response = await deps.createCustomerRepository.handle(customerEntity.data)
    // 3.2. update counter
    await deps.updateMasterNumber.handle(collectionName, input.data.customer_group.code)
    // 4. output
    return { inserted_id: response.inserted_id }
  }
}
