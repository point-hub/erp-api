import type { ISchemaValidation } from '@point-hub/papi'

import { IRetrieveAllCounterRepository } from '@/modules/counters/repositories/retrieve-all.repository'
import { IUpdateCounterRepository } from '@/modules/counters/repositories/update.repository'

import { PermissionEntity } from '../entity'
import { ICreatePermissionRepository } from '../repositories/create.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  code?: string
  name?: string
  address?: string
  phone?: string
}
export interface IDeps {
  cleanObject(object: object): object
  createPermissionRepository: ICreatePermissionRepository
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

export class CreatePermissionUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, createValidation)
    // 2. define entity
    const permissionEntity = new PermissionEntity({
      code: input.code,
      name: input.name,
      address: input.address,
      phone: input.phone,
    })
    permissionEntity.generateCreatedDate()
    const cleanEntity = deps.cleanObject(permissionEntity.data)
    // 3. database operation
    // 3.1 create permission
    const response = await deps.createPermissionRepository.handle(cleanEntity, options)
    // 3.2. update code counter
    const counters = await deps.retrieveAllRepository.handle({ filter: { name: 'permission-code' } }, options)
    await deps.updateRepository.handle(counters.data[0]._id, { count: Number(counters.data[0].count) + 1 }, options)
    // 4. output
    return { inserted_id: response.inserted_id }
  }
}
