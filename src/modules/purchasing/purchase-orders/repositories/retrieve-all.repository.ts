import type { IDatabase, IPagination, IPipeline, IQuery } from '@point-hub/papi'

import { IAuth } from '@/modules/master/users/interface'

import { collectionName } from '../entity'
import { IRetrievePurchaseOrderOutput } from './retrieve.repository'

export interface IRetrieveAllPurchaseOrderOutput {
  data: IRetrievePurchaseOrderOutput[]
  pagination: IPagination
}
export interface IRetrieveAllPurchaseOrderRepository {
  handle(data: { query: IQuery; auth: IAuth }, options?: unknown): Promise<IRetrieveAllPurchaseOrderOutput>
}
export interface IData {
  query: IQuery
  auth: IAuth
}

export class RetrieveAllPurchaseOrderRepository implements IRetrieveAllPurchaseOrderRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(data: IData, options?: unknown): Promise<IRetrieveAllPurchaseOrderOutput> {
    const pipeline: IPipeline[] = []

    pipeline.push(...this.aggregateFilters(data.auth, data.query))
    // pipeline.push(...this.addQuantityPending())

    const response = await this.database.collection(collectionName).aggregate(pipeline, data.query, options)

    return {
      data: response.data as unknown as IRetrievePurchaseOrderOutput[],
      pagination: response.pagination,
    }
  }

  private aggregateFilters(auth: IAuth, query: IQuery) {
    const filtersAnd = []

    if (query.filter?.search) {
      const filtersOr = []
      filtersOr.push({ code: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ name: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ address: { $regex: query.filter?.search, $options: 'i' } })
      filtersOr.push({ phone: { $regex: query.filter?.search, $options: 'i' } })
      filtersAnd.push({ $or: filtersOr })
    }

    if (query.filter?.label) {
      const filtersOr = []
      filtersOr.push({ code: { $regex: query.filter?.label, $options: 'i' } })
      filtersOr.push({ name: { $regex: query.filter?.label, $options: 'i' } })
      filtersAnd.push({ $or: filtersOr })
    }

    if (query.filter?.is_finished) filtersAnd.push({ is_finished: { $eq: JSON.parse(query.filter?.is_finished) } })
    if (query.filter?.is_deleted) filtersAnd.push({ is_deleted: { $exists: false } })
    if (query.filter?.approval_status) filtersAnd.push({ approval_status: { $eq: query.filter?.approval_status } })
    // if (query.filter?.required_down_payment) filtersAnd.push({ required_down_payment: { $eq: true } })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filtersAnd.push({ 'branch._id': { $in: auth.branches.map((item: any) => item._id) } })
    filtersAnd.push({ is_revised: false })

    if (!filtersAnd.length) {
      return []
    }

    return [{ $match: { $and: filtersAnd } }]
  }

  private addQuantityPending() {
    return [
      {
        $addFields: {
          details: {
            $map: {
              input: '$details',
              as: 'detail',
              in: {
                $mergeObjects: [
                  '$$detail',
                  {
                    quantity_pending: {
                      $subtract: [
                        '$$detail.quantity',
                        {
                          $sum: {
                            $map: {
                              input: {
                                $filter: {
                                  input: '$references',
                                  as: 'reference',
                                  cond: {
                                    $in: [
                                      '$$detail.uuid',
                                      {
                                        $map: {
                                          input: '$$reference.details',
                                          as: 'refDetail',
                                          in: '$$refDetail.uuid',
                                        },
                                      },
                                    ],
                                  },
                                },
                              },
                              as: 'ref',
                              in: {
                                $sum: {
                                  $map: {
                                    input: '$$ref.details',
                                    as: 'r',
                                    in: {
                                      $cond: {
                                        if: {
                                          $eq: ['$$r.uuid', '$$detail.uuid'],
                                        },
                                        then: '$$r.quantity',
                                        else: 0,
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      },
    ]
  }
}
