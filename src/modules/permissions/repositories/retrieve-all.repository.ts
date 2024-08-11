import type { IAggregateOutput, IAggregateRepository, IDatabase, IPipeline, IQuery } from '@point-hub/papi'

import { collectionName } from '../entity'
import { IRetrievePermissionOutput } from './retrieve.repository'

export interface IRetrieveAllPermissionOutput extends IAggregateOutput {
  data: IRetrievePermissionOutput[]
}
export interface IRetrieveAllPermissionRepository extends IAggregateRepository {
  handle(query: IQuery, options?: unknown): Promise<IRetrieveAllPermissionOutput>
}

export class RetrieveAllPermissionRepository implements IRetrieveAllPermissionRepository {
  constructor(public database: IDatabase) {}

  async handle(query: IQuery, options?: unknown): Promise<IRetrieveAllPermissionOutput> {
    const pipeline: IPipeline[] = []

    const response = await this.database.collection(collectionName).aggregate(pipeline, query, options)

    return {
      data: response.data as IRetrievePermissionOutput[],
      pagination: response.pagination,
    }
  }
}
