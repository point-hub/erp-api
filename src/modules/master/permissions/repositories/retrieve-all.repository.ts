import type { IDatabase, IPipeline, IQuery } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface INestedBoolean {
  [key: string]: boolean | { [key: string]: boolean }
}

export interface IRetrieveAllPermissionOutput {
  master: INestedBoolean
  purchasing: INestedBoolean
  sales: INestedBoolean
  finance: INestedBoolean
  manufacture: INestedBoolean
  inventory: INestedBoolean
  accounting: INestedBoolean
}

export interface IRetrieveAllPermissionRepository {
  handle(query: IQuery): Promise<IRetrieveAllPermissionOutput>
}

export class RetrieveAllPermissionRepository implements IRetrieveAllPermissionRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(query: IQuery): Promise<IRetrieveAllPermissionOutput> {
    const pipeline: IPipeline[] = []

    const response = await this.database.collection(collectionName).aggregate(pipeline, query, this.options)

    return {
      master: response.data[0].master as INestedBoolean,
      purchasing: response.data[0].purchasing as INestedBoolean,
      sales: response.data[0].sales as INestedBoolean,
      manufacture: response.data[0].manufacture as INestedBoolean,
      finance: response.data[0].finance as INestedBoolean,
      inventory: response.data[0].inventory as INestedBoolean,
      accounting: response.data[0].accounting as INestedBoolean,
    }
  }
}
