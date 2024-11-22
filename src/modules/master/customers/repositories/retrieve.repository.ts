import type { IDatabase, IPipeline } from '@point-hub/papi'

import { IAuthReference } from '@/modules/master/users/interface'

import { collectionName } from '../entity'

interface ICustomerGroup {
  _id: string
  label: string
  code: string
  name: string
}

export interface IRetrieveCustomerOutput {
  _id: string
  label: string
  code: string
  name: string
  address: string
  phone: string
  email: string
  bank_name: string
  bank_branch: string
  bank_account_name: string
  bank_account_number: string
  notes: string
  customer_group: ICustomerGroup
  created_by: IAuthReference
  updated_by: IAuthReference
  created_date: Date
  updated_date: Date
}
export interface IRetrieveCustomerRepository {
  handle(_id: string): Promise<IRetrieveCustomerOutput>
}

export class RetrieveCustomerRepository implements IRetrieveCustomerRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string): Promise<IRetrieveCustomerOutput> {
    const pipeline: IPipeline[] = []

    pipeline.push(...this.aggregateFilters(_id))

    const response = await this.database.collection(collectionName).aggregate(pipeline, {}, this.options)

    return {
      _id: `${response.data[0]._id}`,
      label: `[${response.data[0].code}] ${response.data[0].name}`,
      code: `${response.data[0].code}`,
      name: `${response.data[0].name}`,
      address: `${response.data[0].address ?? ''}`,
      phone: `${response.data[0].phone ?? ''}`,
      email: `${response.data[0].email ?? ''}`,
      bank_name: `${response.data[0].bank_name ?? ''}`,
      bank_branch: `${response.data[0].bank_branch ?? ''}`,
      bank_account_name: `${response.data[0].bank_account_number ?? ''}`,
      bank_account_number: `${response.data[0].bank_account_name ?? ''}`,
      notes: `${response.data[0].notes ?? ''}`,
      customer_group: response.data[0].customer_group as ICustomerGroup,
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
