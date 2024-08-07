import type { ICreateOutput, ISchemaValidation } from '@point-hub/papi'

import { CustomerGroupEntity } from '../entity'
import { ICreateCustomerGroupRepository } from '../repositories/create.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  code?: string
  name?: string
}
export interface IDeps {
  cleanObject(object: object): object
  createRepository: ICreateCustomerGroupRepository
  schemaValidation: ISchemaValidation
}
export interface IOptions {
  session?: unknown
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IOutput extends ICreateOutput {}

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
    // 3.1 create customer group
    const response = await deps.createRepository.handle(cleanEntity, options)
    // response
    return { inserted_id: response.inserted_id }
  }
}
