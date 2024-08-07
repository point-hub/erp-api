import type { ICreateOutput, ICreateRepository, ISchemaValidation } from '@point-hub/papi'
import { IUpdateRepository } from '@point-hub/papi'
import { IRetrieveAllRepository } from '@point-hub/papi'

import { BranchEntity } from '../entity'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  code?: string
  name?: string
  address?: string
  phone?: string
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

export class CreateBranchUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<ICreateOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, createValidation)
    // 2. define entity
    const exampleEntity = new BranchEntity({
      code: input.code,
      name: input.name,
      address: input.address,
      phone: input.phone,
    })
    exampleEntity.generateCreatedDate()
    const cleanEntity = deps.cleanObject(exampleEntity.data)
    // 3. database operation
    // 3.1 create branch
    const response = await deps.createRepository.handle(cleanEntity, options)
    // 3.2. update code counter
    const counters = await deps.retrieveAllRepository.handle({ filter: { name: 'branch-code' } }, options)
    await deps.updateRepository.handle(counters.data[0]._id, { count: Number(counters.data[0].count) + 1 }, options)
    // response
    return { inserted_id: response.inserted_id }
  }
}
