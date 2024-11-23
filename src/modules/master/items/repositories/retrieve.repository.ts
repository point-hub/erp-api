import type { IDatabase, IPipeline } from '@point-hub/papi'

import { IAuthReference } from '@/modules/master/users/interface'

import { collectionName } from '../entity'

interface IItemCategory {
  _id: string
  label: string
  code: string
  name: string
}

interface IChartOfAccount {
  _id: string
  label: string
  number: string
  name: string
}

export interface IRetrieveItemOutput {
  _id: string
  chart_of_account: IChartOfAccount
  category: IItemCategory
  label: string
  code: string
  name: string
  unit: string
  have_production_number: boolean
  have_an_expiry_date: boolean
  notes: string
  created_by: IAuthReference
  updated_by: IAuthReference
  created_date: Date
  updated_date: Date
}
export interface IRetrieveItemRepository {
  handle(_id: string): Promise<IRetrieveItemOutput>
}

export class RetrieveItemRepository implements IRetrieveItemRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string): Promise<IRetrieveItemOutput> {
    const pipeline: IPipeline[] = []

    pipeline.push(...this.aggregateFilters(_id))

    const response = await this.database.collection(collectionName).aggregate(pipeline, {}, this.options)

    return {
      _id: `${response.data[0]._id}`,
      label: `${response.data[0].label}`,
      code: `${response.data[0].code}`,
      name: `${response.data[0].name}`,
      unit: `${response.data[0].unit}`,
      have_production_number: response.data[0].have_production_number as boolean,
      have_an_expiry_date: response.data[0].have_an_expiry_date as boolean,
      notes: `${response.data[0].notes ?? ''}`,
      category: response.data[0].category as IItemCategory,
      chart_of_account: response.data[0].chart_of_account as IChartOfAccount,
      created_by: response.data[0].created_by as IAuthReference,
      updated_by: response.data[0].updated_by as IAuthReference,
      created_date: response.data[0].created_date as Date,
      updated_date: response.data[0].updated_date as Date,
    }
  }

  private aggregateFilters(_id: string) {
    return [{ $match: { _id: _id } }]
  }
}
