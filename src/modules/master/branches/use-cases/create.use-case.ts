import { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import { IRetrieveAllCounterRepository } from '@/modules/counters/repositories/retrieve-all.repository'
import { IUpdateCounterRepository } from '@/modules/counters/repositories/update.repository'
import { IAuth } from '@/modules/master/users/interface'

import { BranchEntity } from '../entity'
import { ICreateBranchRepository } from '../repositories/create.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  auth: IAuth
  data: {
    code?: string
    name?: string
    address?: string
    phone?: string
    notes?: string
  }
}

export interface IDeps {
  objClean: IObjClean
  createBranchRepository: ICreateBranchRepository
  retrieveAllRepository: IRetrieveAllCounterRepository
  updateRepository: IUpdateCounterRepository
  schemaValidation: ISchemaValidation
}

export interface IOutput {
  inserted_id: string
}

export class CreateBranchUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input.data, createValidation)
    // 2. define entity
    const branchEntity = new BranchEntity({
      code: input.data.code,
      name: input.data.name,
      address: input.data.address,
      phone: input.data.phone,
      notes: input.data.notes,
      created_by: input.auth._id,
    })
    branchEntity.generateCreatedDate()
    const cleanEntity = deps.cleanObject(branchEntity.data)
    // 3. database operation
    // 3.1 create branch
    const response = await deps.createBranchRepository.handle(cleanEntity, options)
    // 3.2. update counter
    const counters = await deps.retrieveAllRepository.handle({ filter: { name: 'branches' } }, options)
    await deps.updateRepository.handle(counters.data[0]._id, { count: Number(counters.data[0].count) + 1 }, options)
    // 4. output
    return { inserted_id: response.inserted_id }
  }
}
