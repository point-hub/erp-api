import type { ISchemaValidation } from '@point-hub/papi'

import { ICreateCounterRepository } from '@/modules/counters/repositories/create.repository'
import { IRetrieveAllCounterRepository } from '@/modules/counters/repositories/retrieve-all.repository'
import { IUpdateCounterRepository } from '@/modules/counters/repositories/update.repository'
import { IAuth, IAuthBy } from '@/modules/master/users/interface'

import { SalesQuotationEntity } from '../entity'
import { IBranch, IDetail } from '../interface'
import { ICreateSalesQuotationRepository } from '../repositories/create.repository'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  auth: IAuth
  data: {
    required_date: string
    branch: IBranch
    details: IDetail[]
    notes?: string
    approval_to: IAuthBy
    created_date?: Date
  }
}
export interface IDeps {
  cleanObject(object: object): object
  createSalesQuotationRepository: ICreateSalesQuotationRepository
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
export class CreateSalesQuotationUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. validate schema
    await deps.schemaValidation(input.data, createValidation)
    // 2. generate form number
    const code = 'PR' + deps.dateFormat(new Date(), 'yyMM')
    let formNumber = code
    const counters = await deps.retrieveAllCounterRepository.handle(
      { filter: { name: 'sales.sales_quotations', code: code } },
      options,
    )
    if (!counters.data.length) {
      await deps.createCounterRepository.handle(
        {
          name: 'sales.sales_quotations',
          code: code,
          count: 1,
        },
        options,
      )
      formNumber += '0001'
    } else {
      formNumber += (Number(counters.data[0].count) + 1).toString().padStart(4, '0')
      await deps.updateCounterRepository.handle(
        counters.data[0]._id,
        { count: Number(counters.data[0].count) + 1 },
        options,
      )
    }
    // 2. define entity
    const salesQuotationEntity = new SalesQuotationEntity({
      rev: 0,
      form_number: formNumber,
      required_date: input.data.required_date,
      branch: input.data.branch,
      details: input.data.details,
      notes: input.data.notes,
      approval_to: input.data.approval_to,
      created_by: { ...input.auth, label: input.auth.username },
    })
    salesQuotationEntity.generateCreatedDate()
    const cleanEntity = deps.cleanObject(salesQuotationEntity.data)
    // 3. database operation
    // 3.1 create sales quotation
    const response = await deps.createSalesQuotationRepository.handle(cleanEntity, options)
    // 4. output
    return { inserted_id: response.inserted_id }
  }
}
