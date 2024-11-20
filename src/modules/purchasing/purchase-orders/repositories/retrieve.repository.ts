import type { IDatabase, IPipeline } from '@point-hub/papi'

import { IAuthReference } from '@/modules/master/users/interface'

import { collectionName } from '../entity'
import { IPurchaseRequest, ISupplier } from '../interface'

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

export interface IRetrievePurchaseOrderOutput {
  _id: string
  revised_count: number
  form_number: string
  purchase_request: {
    _id: string
    label: string
  }
  supplier: {
    _id: string
    label: string
    code: string
    name: string
  }
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
export interface IRetrievePurchaseOrderRepository {
  handle(_id: string): Promise<IRetrievePurchaseOrderOutput>
}

export class RetrievePurchaseOrderRepository implements IRetrievePurchaseOrderRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string): Promise<IRetrievePurchaseOrderOutput> {
    const pipeline: IPipeline[] = []

    pipeline.push(...this.aggregateFilters(_id))

    const response = await this.database.collection(collectionName).aggregate(pipeline, {}, this.options)

    return {
      _id: response.data[0]._id as string,
      revised_count: response.data[0].revised_count as number,
      form_number: response.data[0].form_number as string,
      purchase_request: response.data[0].purchase_request as IPurchaseRequest,
      supplier: response.data[0].supplier as ISupplier,
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
