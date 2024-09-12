import type { ISchemaValidation } from '@point-hub/papi'

import { ICreateCounterRepository } from '@/modules/counters/repositories/create.repository'
import { IRetrieveAllCounterRepository } from '@/modules/counters/repositories/retrieve-all.repository'
import { IUpdateCounterRepository } from '@/modules/counters/repositories/update.repository'
import { IAuth } from '@/modules/master/users/interface'

import { PurchaseRequestEntity } from '../entity'
import { ICreatePurchaseRequestRepository } from '../repositories/create.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  auth: IAuth
  data: {
    branch?: {
      _id?: string
      label?: string
      code?: string
      name?: string
    }
    items?: {
      item?: {
        _id?: string
        label?: string
        code?: string
        name?: string
        unit?: string
      }
      notes?: string
      quantity?: number
      allocation?: {
        _id?: string
        label?: string
        code?: string
        name?: string
      }
    }
    notes?: string
    approval_to?: {
      _id?: string
      label?: string
      name?: string
      username?: string
      email?: string
    }
    created_by?: {
      _id?: string
      label?: string
      name?: string
      username?: string
      email?: string
    }
    updated_by?: {
      _id?: string
      label?: string
      name?: string
      username?: string
      email?: string
    }
    created_date?: Date
    updated_date?: Date
    required_date?: Date
  }
}
export interface IDeps {
  cleanObject(object: object): object
  createPurchaseRequestRepository: ICreatePurchaseRequestRepository
  retrieveAllCounterRepository: IRetrieveAllCounterRepository
  createCounterRepository: ICreateCounterRepository
  updateCounterRepository: IUpdateCounterRepository
  schemaValidation: ISchemaValidation
  dateFormat(date: Date | number | string, format: string): string
}
export interface IOptions {
  session?: unknown
}
export interface IOutput {
  inserted_id: string
}
export class CreatePurchaseRequestUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input.data, createValidation)
    // a
    let code = 'PR' + deps.dateFormat(new Date(), 'yyMM')
    const counters = await deps.retrieveAllCounterRepository.handle(
      { filter: { name: 'purchasing.purchase_requests', code: code } },
      options,
    )
    if (!counters.data.length) {
      await deps.createCounterRepository.handle(
        {
          name: 'purchasing.purchase_requests',
          code: code,
          count: 1,
        },
        options,
      )
      code += '0001'
    } else {
      code += (Number(counters.data[0].count) + 1).toString().padStart(4, '0')
      await deps.updateCounterRepository.handle(
        counters.data[0]._id,
        { count: Number(counters.data[0].count) + 1 },
        options,
      )
    }
    // 2. define entity
    const purchaseRequestEntity = new PurchaseRequestEntity({
      rev: 0,
      form_number: code,
      required_date: input.data.required_date,
      branch: input.data.branch,
      items: input.data.items,
      notes: input.data.notes,
      approval_to: input.data.approval_to,
      created_by: {
        _id: input.auth._id,
        name: input.auth.name,
        username: input.auth.username,
        email: input.auth.email,
      },
    })
    purchaseRequestEntity.generateCreatedDate()
    const cleanEntity = deps.cleanObject(purchaseRequestEntity.data)
    // 3. database operation
    // 3.1 create purchase request
    const response = await deps.createPurchaseRequestRepository.handle(cleanEntity, options)
    // 4. output
    return { inserted_id: response.inserted_id }
  }
}
