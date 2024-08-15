import type { ICreateOutput, ISchemaValidation } from '@point-hub/papi'

import { IRetrieveAllCounterRepository } from '@/modules/counters/repositories/retrieve-all.repository'
import { IUpdateCounterRepository } from '@/modules/counters/repositories/update.repository'

import { CustomerEntity } from '../entity'
import { ICreateCustomerRepository } from '../repositories/create.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  customer_group_id?: string
  code?: string
  name?: string
  address?: string
  phone?: string
  email?: string
  notes?: string
  bank_name?: string
  bank_branch?: string
  bank_account_name?: string
  bank_account_number?: string
}
export interface IDeps {
  cleanObject(object: object): object
  createCustomerRepository: ICreateCustomerRepository
  retrieveAllCounterRepository: IRetrieveAllCounterRepository
  updateCounterRepository: IUpdateCounterRepository
  schemaValidation: ISchemaValidation
}
export interface IOptions {
  session?: unknown
}

export class CreateCustomerUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<ICreateOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, createValidation)
    // 2. define entity
    const exampleEntity = new CustomerEntity({
      customer_group_id: input.customer_group_id,
      code: input.code,
      name: input.name,
      address: input.address,
      phone: input.phone,
      email: input.email,
      notes: input.notes,
      bank_name: input.bank_name,
      bank_branch: input.bank_branch,
      bank_account_name: input.bank_account_name,
      bank_account_number: input.bank_account_number,
    })
    exampleEntity.generateCreatedDate()
    const cleanEntity = deps.cleanObject(exampleEntity.data)
    // 3. database operation
    // 3.1 create customer
    const response = await deps.createCustomerRepository.handle(cleanEntity, options)
    // 3.2. update code counter
    const counters = await deps.retrieveAllCounterRepository.handle({ filter: { name: 'customer-code' } }, options)
    await deps.updateCounterRepository.handle(
      counters.data[0]._id,
      { count: Number(counters.data[0].count) + 1 },
      options,
    )
    // 4. output
    return { inserted_id: response.inserted_id }
  }
}
