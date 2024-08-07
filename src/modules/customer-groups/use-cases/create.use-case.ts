import type { ISchemaValidation } from '@point-hub/papi'

import { CustomerGroupEntity } from '../entity'
import { ICreateCustomerGroupRepository } from '../repositories/create.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  code?: string
  name?: string
}
export interface IDeps {
  cleanObject(object: object): object
  createCustomerGroupRepository: ICreateCustomerGroupRepository
  schemaValidation: ISchemaValidation
}
export interface IOptions {
  session?: unknown
}
export interface IOutput {
  inserted_id: string
}

export class CreateCustomerGroupUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, createValidation)
    // 2. define entity
    const customerGroupEntity = new CustomerGroupEntity({
      code: input.code,
      name: input.name,
    })
    customerGroupEntity.generateCreatedDate()
    const cleanEntity = deps.cleanObject(customerGroupEntity.data)
    // 3. database operation
    const response = await deps.createCustomerGroupRepository.handle(cleanEntity, options)
    // 4. output
    return { inserted_id: response.inserted_id }
  }
}
