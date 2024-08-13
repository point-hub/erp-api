import type { ISchemaValidation } from '@point-hub/papi'

import { SupplierGroupEntity } from '../entity'
import { ICreateSupplierGroupRepository } from '../repositories/create.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  code?: string
  name?: string
}
export interface IDeps {
  cleanObject(object: object): object
  createSupplierGroupRepository: ICreateSupplierGroupRepository
  schemaValidation: ISchemaValidation
}
export interface IOptions {
  session?: unknown
}
export interface IOutput {
  inserted_id: string
}

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
    const response = await deps.createSupplierGroupRepository.handle(cleanEntity, options)
    // 4. output
    return { inserted_id: response.inserted_id }
  }
}
