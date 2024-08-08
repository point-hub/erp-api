import type { ISchemaValidation, IUpdateOutput } from '@point-hub/papi'

import { CustomerEntity } from '../entity'
import { IUpdateCustomerRepository } from '../repositories/update.repository'
import { updateValidation } from '../validations/update.validation'

export interface IInput {
  _id: string
  data: {
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
}
export interface IDeps {
  cleanObject(object: object): object
  schemaValidation: ISchemaValidation
  updateCustomerRepository: IUpdateCustomerRepository
}
export interface IOptions {
  session?: unknown
}

export class UpdateCustomerUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IUpdateOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, updateValidation)
    // 2. define entity
    const customerEntity = new CustomerEntity({
      customer_group_id: input.data.customer_group_id,
      code: input.data.code,
      name: input.data.name,
      address: input.data.address,
      phone: input.data.phone,
      email: input.data.email,
      notes: input.data.notes,
      bank_name: input.data.bank_name,
      bank_branch: input.data.bank_branch,
      bank_account_name: input.data.bank_account_name,
      bank_account_number: input.data.bank_account_number,
    })
    customerEntity.generateUpdatedDate()
    // 3. database operation
    const response = await deps.updateCustomerRepository.handle(input._id, customerEntity.data, options)
    // 4. response
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
