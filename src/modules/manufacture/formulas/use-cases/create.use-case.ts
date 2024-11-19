import { IObjClean } from '@point-hub/express-utils'
import type { ISchemaValidation } from '@point-hub/papi'

import { IRetrieveAllCounterRepository } from '@/modules/counters/repositories/retrieve-all.repository'
import { IUpdateCounterRepository } from '@/modules/counters/repositories/update.repository'
import { IAuth } from '@/modules/master/users/interface'

import { FormulaEntity } from '../entity'
import { ICreateFormulaRepository } from '../repositories/create.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  auth: IAuth
  data: {
    name?: string
    finished_goods: {
      item?: {
        _id: string
        label: string
        code: string
        name: string
        unit: string
      }
      quantity: number
    }[]
    raw_materials: {
      item?: {
        _id: string
        label: string
        code: string
        name: string
        unit: string
      }
      quantity: number
    }[]
    process?: {
      _id: string
      label: string
      code: string
      name: string
    }
    approval_to?: {
      _id: string
      label: string
      username: string
      name: string
      email: string
    }
    notes?: string
  }
}

export interface IDeps {
  objClean: IObjClean
  createFormulaRepository: ICreateFormulaRepository
  retrieveAllRepository: IRetrieveAllCounterRepository
  updateRepository: IUpdateCounterRepository
  schemaValidation: ISchemaValidation
}

export interface IOutput {
  inserted_id: string
}

export class CreateFormulaUseCase {
  static async handle(input: IInput, deps: IDeps): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input.data, createValidation)
    // 2. define entity
    const formulaEntity = new FormulaEntity({
      name: input.data.name,
      process: input.data.process,
      finished_goods: input.data.finished_goods,
      raw_materials: input.data.raw_materials,
      approval_to: input.data.approval_to,
      notes: input.data.notes,
      created_by: {
        _id: input.auth._id,
        label: input.auth.name,
        email: input.auth.email,
      },
    })
    formulaEntity.generateDate('created_date')
    formulaEntity.data = deps.objClean(formulaEntity.data)
    // 3. database operation
    // 3.1 create formula
    const response = await deps.createFormulaRepository.handle(formulaEntity.data)
    // 3.2. update counter
    const counters = await deps.retrieveAllRepository.handle({ filter: { name: 'formulas' } })
    await deps.updateRepository.handle(counters.data[0]._id, { count: Number(counters.data[0].count) + 1 })
    // 4. output
    return { inserted_id: response.inserted_id }
  }
}
