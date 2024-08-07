import type { ISchemaValidation, IUpdateOutput } from '@point-hub/papi'

import { SupplierEntity } from '../entity'
import { IUpdateSupplierRepository } from '../repositories/update.repository'
import { updateValidation } from '../validations/update.validation'

export interface IInput {
  _id: string
  data: {
    supplier_group_id?: string
    code?: string
    name?: string
  }
}
export interface IDeps {
  cleanObject(object: object): object
  schemaValidation: ISchemaValidation
  updateSupplierRepository: IUpdateSupplierRepository
}
export interface IOptions {
  session?: unknown
}

export class UpdateSupplierUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IUpdateOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, updateValidation)
    // 2. define entity
    const supplierEntity = new SupplierEntity({
      supplier_group_id: input.data.supplier_group_id,
      code: input.data.code,
      name: input.data.name,
    })
    supplierEntity.generateUpdatedDate()
    // 3. database operation
    const response = await deps.updateSupplierRepository.handle(input._id, supplierEntity.data, options)
    // 4. response
    return {
      matched_count: response.matched_count,
      modified_count: response.modified_count,
    }
  }
}
