import type { IDatabase, IPipeline } from '@point-hub/papi'

import { IAuthReference } from '@/modules/master/users/interface'

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

export interface IDetails {
  item: IItem
  quantity: string
  notes: string
  allocation: IAllocation
}

export interface IRetrievePurchaseRequestOutput {
  _id: string
  revised_count: number
  form_number: string
  required_date: Date
  branch: IBranch
  details: IDetails[]
  notes: string
  approval_status: 'pending' | 'approved' | 'rejected'
  approval_to: IAuthReference
  rejected_reason: string
  created_by: IAuthReference
  updated_by: IAuthReference
  approval_date: Date
  created_date: Date
  updated_date: Date
  deleted_by: IAuthReference
  deleted_date: Date
  deleted_reason: string
  is_deleted: boolean
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
      revised_count: response.data[0].revised_count as number,
      form_number: response.data[0].form_number as string,
      required_date: response.data[0].required_date as Date,
      branch: response.data[0].branch as IBranch,
      details: response.data[0].details as IDetails[],
      notes: response.data[0].notes as string,
      approval_status: response.data[0].approval_status as 'pending' | 'approved' | 'rejected',
      approval_to: response.data[0].approval_to as IAuthReference,
      rejected_reason: response.data[0].rejected_reason as string,
      created_by: response.data[0].created_by as IAuthReference,
      updated_by: response.data[0].updated_by as IAuthReference,
      approval_date: response.data[0].approval_date as Date,
      created_date: response.data[0].created_date as Date,
      updated_date: response.data[0].updated_date as Date,
      deleted_by: response.data[0].deleted_by as IAuthReference,
      deleted_date: response.data[0].deleted_date as Date,
      deleted_reason: response.data[0].deleted_reason as string,
      is_deleted: response.data[0].is_deleted as boolean,
    }
  }

  private aggregateFilters(_id: string) {
    return [{ $match: { _id: _id } }]
  }
}
