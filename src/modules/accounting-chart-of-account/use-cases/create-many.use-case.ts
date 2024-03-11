import type { ICreateManyOutput, ICreateManyRepository, ISchemaValidation } from '@point-hub/papi'

import { ChartOfAccountEntity } from '../entity'
import { createManyValidation } from '../validations/create-many.validation'

export interface IInput {
  chartOfAccounts: {
    name?: string
    phone?: string
  }[]
}
export interface IDeps {
  cleanObject(object: object): object
  schemaValidation: ISchemaValidation
  createManyRepository: ICreateManyRepository
}
export interface IOptions {
  session?: unknown
}

export class CreateManyChartOfAccountUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<ICreateManyOutput> {
    const entities = []
    for (const document of input.chartOfAccounts) {
      const chartOfAccountEntity = new ChartOfAccountEntity({
        name: document.name,
        phone: document.phone,
      })
      chartOfAccountEntity.generateCreatedDate()
      entities.push(deps.cleanObject(chartOfAccountEntity.data))
    }
    await deps.schemaValidation({ chartOfAccounts: entities }, createManyValidation)
    const response = await deps.createManyRepository.handle(entities, options)
    return {
      inserted_ids: response.inserted_ids,
      inserted_count: response.inserted_count,
    }
  }
}
