import type { IDatabase, IPagination, IPipeline, IQuery } from '@point-hub/papi'

import { collectionName } from '../entity'
import { IRetrieveCustomerOutput } from './retrieve.repository'

export interface IRetrieveAllCustomerOutput {
  data: IRetrieveCustomerOutput[]
  pagination: IPagination
}
export interface IRetrieveAllCustomerRepository {
  handle(query: IQuery): Promise<IRetrieveAllCustomerOutput>
}

export class RetrieveAllCustomerRepository implements IRetrieveAllCustomerRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(query: IQuery): Promise<IRetrieveAllCustomerOutput> {
    const pipeline: IPipeline[] = []

    pipeline.push(...this.aggregateJoinCustomerGroup())
    pipeline.push(...this.aggregateFilters(query))
    pipeline.push(...this.aggregateJoinCreatedBy())
    pipeline.push(...this.aggregateJoinUpdatedBy())
    pipeline.push(...this.aggregateAddFields())

    const response = await this.database.collection(collectionName).aggregate(pipeline, query, this.options)

    return {
      data: response.data as unknown as IRetrieveCustomerOutput[],
      pagination: response.pagination,
    }
  }

  private aggregateJoinCreatedBy() {
    return [
      {
        $lookup: {
          from: 'users',
          localField: 'created_by',
          foreignField: '_id',
          pipeline: [{ $project: { _id: 1, username: 1, name: 1, email: 1 } }],
          as: 'created_by',
        },
      },
      {
        $unwind: {
          path: '$created_by',
          preserveNullAndEmptyArrays: true,
        },
      },
    ]
  }

  private aggregateJoinUpdatedBy() {
    return [
      {
        $lookup: {
          from: 'users',
          localField: 'updated_by',
          foreignField: '_id',
          pipeline: [{ $project: { _id: 1, username: 1, name: 1, email: 1 } }],
          as: 'updated_by',
        },
      },
      {
        $unwind: {
          path: '$updated_by',
          preserveNullAndEmptyArrays: true,
        },
      },
    ]
  }

  private aggregateJoinCustomerGroup() {
    return [
      {
        $lookup: {
          from: 'customer_groups',
          localField: 'customer_group_id',
          foreignField: '_id',
          pipeline: [{ $project: { _id: 1, code: 1, name: 1 } }],
          as: 'customer_group',
        },
      },
      {
        $unwind: {
          path: '$customer_group',
          preserveNullAndEmptyArrays: true,
        },
      },
      { $unset: ['customer_group_id'] },
    ]
  }

  private aggregateFilters(query: IQuery) {
    const filtersAnd = []

    if (query.filter?.search) {
      const filtersOr = []
      filtersOr.push({ code: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ name: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ address: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ phone: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ 'customer_group.code': { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ 'customer_group.name': { $regex: query.filter?.search, $options: 'i' } })
      filtersAnd.push({ $or: filtersOr })
    }

    if (query.filter?.label) {
      const filtersOr = []
      filtersOr.push({ code: { $regex: query.filter?.label, $options: 'i' } })
      filtersOr.push({ name: { $regex: query.filter?.label, $options: 'i' } })
      filtersAnd.push({ $or: filtersOr })
    }

    if (query.filter?.code) filtersAnd.push({ code: { $regex: query.filter?.code, $options: 'i' } })
    if (query.filter?.name) filtersAnd.push({ name: { $regex: query.filter?.name, $options: 'i' } })
    if (query.filter?.address) filtersAnd.push({ address: { $regex: query.filter?.address, $options: 'i' } })
    if (query.filter?.phone) filtersAnd.push({ phone: { $regex: query.filter?.phone, $options: 'i' } })
    if (query.filter?.customer_group_id)
      filtersAnd.push({ 'customer_group._id': { $eq: query.filter?.customer_group_id } })
    if (query.filter?.customer_group)
      filtersAnd.push({
        $or: [
          { 'customer_group.code': { $regex: query.filter?.customer_group, $options: 'i' } },
          { 'customer_group.name': { $regex: query.filter?.customer_group, $options: 'i' } },
        ],
      })

    if (!filtersAnd.length) {
      return []
    }

    return [{ $match: { $and: filtersAnd } }]
  }

  private aggregateAddFields() {
    return [
      {
        $addFields: {
          label: {
            $concat: ['[', '$code', '] ', '$name'],
          },
        },
      },
    ]
  }
}
