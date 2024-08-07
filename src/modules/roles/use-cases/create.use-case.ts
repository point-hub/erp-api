import type { ISchemaValidation } from '@point-hub/papi'

import { IRetrieveAllCounterRepository } from '@/modules/counters/repositories/retrieve-all.repository'
import { IUpdateCounterRepository } from '@/modules/counters/repositories/update.repository'

import { RoleEntity } from '../entity'
import { ICreateRoleRepository } from '../repositories/create.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  code?: string
  name?: string
  address?: string
  phone?: string
}
export interface IDeps {
  cleanObject(object: object): object
  createRoleRepository: ICreateRoleRepository
  retrieveAllRepository: IRetrieveAllCounterRepository
  updateRepository: IUpdateCounterRepository
  schemaValidation: ISchemaValidation
}
export interface IOptions {
  session?: unknown
}
export interface IOutput {
  inserted_id: string
}

export class CreateRoleUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, createValidation)
    // 2. define entity
    const roleEntity = new RoleEntity({
      code: input.code,
      name: input.name,
      address: input.address,
      phone: input.phone,
    })
    roleEntity.generateCreatedDate()
    const cleanEntity = deps.cleanObject(roleEntity.data)
    // 3. database operation
    // 3.1 create role
    const response = await deps.createRoleRepository.handle(cleanEntity, options)
    // 3.2. update code counter
    const counters = await deps.retrieveAllRepository.handle({ filter: { name: 'role-code' } }, options)
    await deps.updateRepository.handle(counters.data[0]._id, { count: Number(counters.data[0].count) + 1 }, options)
    // 4. output
    return { inserted_id: response.inserted_id }
  }
}
