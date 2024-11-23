import type { IDatabase, IPipeline } from '@point-hub/papi'

import { IAuthReference } from '@/modules/master/users/interface'

import { collectionName } from '../entity'

interface IBranch {
  _id: string
  label: string
  code: string
  name: string
}

export interface IRetrieveWarehouseOutput {
  _id: string
  label: string
  code: string
  name: string
  address: string
  phone: string
  notes: string
  branch: IBranch
  created_by: IAuthReference
  updated_by: IAuthReference
  created_date: Date
  updated_date: Date
}
export interface IRetrieveWarehouseRepository {
  handle(_id: string): Promise<IRetrieveWarehouseOutput>
}

export class RetrieveWarehouseRepository implements IRetrieveWarehouseRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string): Promise<IRetrieveWarehouseOutput> {
    const pipeline: IPipeline[] = []

    pipeline.push(...this.aggregateFilters(_id))

    const response = await this.database.collection(collectionName).aggregate(pipeline, {}, this.options)

    return {
      _id: `${response.data[0]._id}`,
      label: `${response.data[0].code}`,
      code: `${response.data[0].code}`,
      name: `${response.data[0].name}`,
      address: `${response.data[0].address ?? ''}`,
      phone: `${response.data[0].phone ?? ''}`,
      notes: `${response.data[0].notes ?? ''}`,
      branch: response.data[0].branch as IBranch,
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
