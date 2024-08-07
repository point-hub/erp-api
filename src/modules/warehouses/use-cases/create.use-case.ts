import type { ICreateOutput, ICreateRepository, ISchemaValidation } from '@point-hub/papi'
import { IUpdateRepository } from '@point-hub/papi'
import { IRetrieveAllRepository } from '@point-hub/papi'

import { WarehouseEntity } from '../entity'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  branch_id?: string
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

export class CreateWarehouseUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<ICreateOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, createValidation)
    // 2. define entity
    const exampleEntity = new WarehouseEntity({
      branch_id: input.branch_id,
      code: input.code,
      name: input.name,
    })
    exampleEntity.generateCreatedDate()
    const cleanEntity = deps.cleanObject(exampleEntity.data)
    // 3. database operation
    // 3.1 create warehouse
    const response = await deps.createRepository.handle(cleanEntity, options)
    // 3.2. update code counter
    const counters = await deps.retrieveAllRepository.handle({ filter: { name: 'warehouse-code' } }, options)
    await deps.updateRepository.handle(counters.data[0]._id, { count: Number(counters.data[0].count) + 1 }, options)
    // response
    return { inserted_id: response.inserted_id }
  }
}
