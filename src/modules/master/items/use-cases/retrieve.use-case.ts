import { IRetrieveItemRepository } from '../repositories/retrieve.repository'

export interface IInput {
  _id: string
}
export interface IDeps {
  retrieveItemRepository: IRetrieveItemRepository
}
export interface IOptions {
  session: unknown
}
export interface IOutput {
  _id: string
  category: {
    _id: string
    code: string
    name: string
  }
  chart_of_account: {
    _id: string
    number: string
    name: string
  }
  code: string
  name: string
  unit: string
  have_production_number: boolean
  have_an_expiry_date: boolean
  notes: string
  created_date: Date
  updated_date: Date
}

export class RetrieveItemUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IOutput> {
    // 1. database operation
    const response = await deps.retrieveItemRepository.handle(input._id, options)
    // 2. output
    return {
      _id: response._id,
      chart_of_account: response.chart_of_account,
      category: response.category,
      code: response.code,
      name: response.name,
      unit: response.unit,
      have_production_number: response.have_production_number,
      have_an_expiry_date: response.have_an_expiry_date,
      notes: response.notes,
      created_date: response.created_date,
      updated_date: response.updated_date,
    }
  }
}
