import type { IDatabase, IPipeline } from '@point-hub/papi'

import { IAuthBy } from '@/modules/master/users/interface'

import { collectionName } from '../entity'

export interface IBranch {
  _id: string
  code: string
  name: string
  label: string
}

export interface IItem {
  _id: string
  code: string
  name: string
  unit: string
  label: string
}

export interface IAllocation {
  _id: string
  code: string
  name: string
  label: string
}

export interface IItems {
  item: IItem
  quantity: string
  notes: string
  allocation: IAllocation
}

export interface IRetrievePurchaseRequestOutput {
  _id: string
  rev: number
  form_number: string
  required_date: Date
  branch: IBranch
  items: IItems[]
  notes: string
  approval_to: IAuthBy
  created_by: IAuthBy
  updated_by: IAuthBy
  approval_date: Date
  created_date: Date
  updated_date: Date
}
export interface IRetrievePurchaseRequestRepository {
  handle(_id: string, options?: unknown): Promise<IRetrievePurchaseRequestOutput>
}

export class RetrievePurchaseRequestRepository implements IRetrievePurchaseRequestRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, options?: unknown): Promise<IRetrievePurchaseRequestOutput> {
    const pipeline: IPipeline[] = []

    pipeline.push(...this.aggregateFilters(_id))

    const response = await this.database.collection(collectionName).aggregate(pipeline, {}, options)

    return {
      _id: response.data[0]._id as string,
      rev: response.data[0].rev as number,
      form_number: response.data[0].form_number as string,
      required_date: response.data[0].required_date as Date,
      branch: response.data[0].branch as IBranch,
      items: response.data[0].items as IItems[],
      notes: response.data[0].notes as string,
      approval_to: response.data[0].approval_to as IAuthBy,
      created_by: response.data[0].created_by as IAuthBy,
      updated_by: response.data[0].updated_by as IAuthBy,
      approval_date: response.data[0].approval_date as Date,
      created_date: response.data[0].created_date as Date,
      updated_date: response.data[0].updated_date as Date,
    }
  }

  private aggregateFilters(_id: string) {
    return [{ $match: { _id: _id } }]
  }
}
