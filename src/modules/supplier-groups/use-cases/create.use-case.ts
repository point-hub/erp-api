import type { ICreateOutput, ICreateRepository, ISchemaValidation } from '@point-hub/papi'
import { IUpdateRepository } from '@point-hub/papi'
import { IRetrieveAllRepository } from '@point-hub/papi'

import { SupplierGroupEntity } from '../entity'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  code?: string
  name?: string
}
export interface IDeps {
  cleanObject(object: object): object
  createRepository: ICreateRepository
  retrieveAllRepository: IRetrieveAllRepository
  updateRepository: IUpdateRepository
  schemaValidation: ISchemaValidation
}
export interface IOptions {
  session?: unknown
}

export class CreateSupplierGroupUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<ICreateOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, createValidation)
    // 2. define entity
    const exampleEntity = new SupplierGroupEntity({
      code: input.code,
      name: input.name,
    })
    exampleEntity.generateCreatedDate()
    const cleanEntity = deps.cleanObject(exampleEntity.data)
    // 3. database operation
    // 3.1 create supplier group
    const response = await deps.createRepository.handle(cleanEntity, options)
    // response
    return { inserted_id: response.inserted_id }
  }
}
