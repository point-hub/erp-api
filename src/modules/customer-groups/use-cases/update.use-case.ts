import type { ISchemaValidation, IUpdateOutput, IUpdateRepository } from '@point-hub/papi'

import { CustomerGroupEntity } from '../entity'
import { updateValidation } from '../validations/update.validation'

export interface IInput {
  _id: string
  data: {
    code?: string
    name?: string
  }
}
export interface IDeps {
  cleanObject(object: object): object
  schemaValidation: ISchemaValidation
  updateRepository: IUpdateRepository
}
export interface IOptions {
  session?: unknown
}

export class UpdateCustomerGroupUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IUpdateOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, updateValidation)
    // 2. define entity
    const customerGroupEntity = new CustomerGroupEntity({
      name: input.data.name,
    })
    customerGroupEntity.generateUpdatedDate()
    // 3. database operation
    const response = await deps.updateRepository.handle(input._id, customerGroupEntity.data, options)
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
