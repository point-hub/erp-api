import { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import { IRetrieveAllCounterRepository } from '@/modules/counters/repositories/retrieve-all.repository'
import { IUpdateCounterRepository } from '@/modules/counters/repositories/update.repository'
import { IAuth } from '@/modules/master/users/interface'

import { MachineEntity } from '../entity'
import { ICreateMachineRepository } from '../repositories/create.repository'
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
  createMachineRepository: ICreateMachineRepository
  retrieveAllRepository: IRetrieveAllCounterRepository
  updateRepository: IUpdateCounterRepository
  schemaValidation: ISchemaValidation
}

export interface IOutput {
  inserted_id: string
}

export class CreateMachineUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input.data, createValidation)
    // 2. define entity
    const machineEntity = new MachineEntity({
      code: input.data.code,
      name: input.data.name,
      notes: input.data.notes,
      created_by: {
        _id: input.auth._id,
        label: input.auth.name,
        email: input.auth.email,
      },
    })
    machineEntity.generateDate('created_date')
    const cleanEntity = deps.objClean(machineEntity.data)
    // 3. database operation
    // 3.1 create machine
    const response = await deps.createMachineRepository.handle(cleanEntity)
    // 3.2. update counter
    const counters = await deps.retrieveAllRepository.handle({ filter: { name: 'machines' } })
    await deps.updateRepository.handle(counters.data[0]._id, { count: Number(counters.data[0].count) + 1 })
    // 4. output
    return { inserted_id: response.inserted_id }
  }
}
