import { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import { IRetrieveAllCounterRepository } from '@/modules/counters/repositories/retrieve-all.repository'
import { IUpdateCounterRepository } from '@/modules/counters/repositories/update.repository'
import { IAuth } from '@/modules/master/users/interface'

import { ProcessEntity } from '../entity'
import { ICreateProcessRepository } from '../repositories/create.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  auth: IAuth
  data: {
    code?: string
    name?: string
    notes?: string
  }
}

export interface IDeps {
  objClean: IObjClean
  createProcessRepository: ICreateProcessRepository
  retrieveAllRepository: IRetrieveAllCounterRepository
  updateRepository: IUpdateCounterRepository
  schemaValidation: ISchemaValidation
}

export interface IOutput {
  inserted_id: string
}

export class CreateProcessUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input.data, createValidation)
    // 2. define entity
    const processEntity = new ProcessEntity({
      code: input.data.code,
      name: input.data.name,
      notes: input.data.notes,
      created_by: input.auth._id,
    })
    processEntity.generateDate('created_date')
    const cleanEntity = deps.objClean(processEntity.data)
    // 3. database operation
    const response = await deps.createProcessRepository.handle(cleanEntity)
    // 4. output
    return { inserted_id: response.inserted_id }
  }
}
