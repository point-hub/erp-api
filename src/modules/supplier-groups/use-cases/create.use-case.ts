import type { ICreateOutput, ISchemaValidation } from '@point-hub/papi'

import { SupplierGroupEntity } from '../entity'
import { ICreateSupplierGroupRepository } from '../repositories/create.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  code?: string
  name?: string
}
export interface IDeps {
  cleanObject(object: object): object
  createRepository: ICreateSupplierGroupRepository
  schemaValidation: ISchemaValidation
}
export interface IOptions {
  session?: unknown
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IOutput extends ICreateOutput {}

export class CreateSupplierGroupUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, createValidation)
    // 2. define entity
    const supplierGroupEntity = new SupplierGroupEntity({
      code: input.code,
      name: input.name,
    })
    supplierGroupEntity.generateCreatedDate()
    const cleanEntity = deps.cleanObject(supplierGroupEntity.data)
    // 3. database operation
    // 3.1 create supplier group
    const response = await deps.createRepository.handle(cleanEntity, options)
    // response
    return { inserted_id: response.inserted_id }
  }
}
