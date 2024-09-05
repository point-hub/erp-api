import type { IDatabase, IPipeline, IRetrieveOutput, IRetrieveRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IRetrieveSettingJournalOutput extends IRetrieveOutput {
  code?: string
  name?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  branch?: any
  created_date?: Date
  updated_date?: Date
}
export interface IRetrieveSettingJournalRepository extends IRetrieveRepository {
  handle(_id: string, options?: unknown): Promise<IRetrieveSettingJournalOutput>
}

export class RetrieveSettingJournalRepository implements IRetrieveSettingJournalRepository {
  public collection = collectionName

  constructor(public database: IDatabase) {}

  async handle(_id: string, options?: unknown): Promise<IRetrieveSettingJournalOutput> {
    const pipeline: IPipeline[] = []

    const filters = [] // filter keys using "and" logic

    filters.push({ _id: _id })

    if (filters.length) {
      pipeline.push({ $match: { $and: filters } })
    }

    pipeline.push(
      {
        $unwind: {
          path: '$journals',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'chart_of_accounts',
          localField: 'journals.chart_of_account_id',
          foreignField: '_id',
          pipeline: [{ $project: { number: 1, name: 1 } }],
          as: 'lookup_chart_of_account',
        },
      },
      {
        $unwind: {
          path: '$lookup_chart_of_account',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          'lookup_chart_of_account.label': {
            $cond: {
              if: { $ne: [{ $type: '$lookup_chart_of_account' }, 'missing'] },
              then: { $concat: ['[', '$lookup_chart_of_account.number', '] ', '$lookup_chart_of_account.name'] },
              else: '$$REMOVE',
            },
          },
        },
      },
      {
        $group: {
          _id: '$_id',
          module: { $first: '$module' },
          feature: { $first: '$feature' },
          journals: {
            $push: {
              _id: '$journals._id',
              description: '$journals.description',
              account: '$journals.account',
              position: '$journals.position',
              subledger: '$journals.subledger',
              editable: '$journals.editable',
              category: '$journals.category',
              type: '$journals.type',
              value: '$journals.value',
              chart_of_account: {
                _id: '$lookup_chart_of_account._id',
                label: '$lookup_chart_of_account.label',
                number: '$lookup_chart_of_account.number',
                name: '$lookup_chart_of_account.name',
              },
            },
          },
        },
      },
    )
    const response = await this.database.collection(this.collection).aggregate(pipeline, {}, options)

    return {
      _id: response.data[0]._id as string,
      ...response.data[0],
    }
  }
}
