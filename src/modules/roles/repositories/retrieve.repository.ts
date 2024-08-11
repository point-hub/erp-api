import type { IDatabase, IRetrieveOutput, IRetrieveRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IRetrieveRoleOutput extends IRetrieveOutput {
  code: string
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  permission: { [key: string]: any }
  created_date: string
  updated_date: string
}
export interface IRetrieveRoleRepository extends IRetrieveRepository {
  handle(_id: string, options?: unknown): Promise<IRetrieveRoleOutput>
}

export class RetrieveRoleRepository implements IRetrieveRoleRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, options?: unknown): Promise<IRetrieveRoleOutput> {
    const response = await this.database.collection(collectionName).retrieve(_id, options)
    return {
      _id: response._id,
      code: response.code as string,
      name: response.name as string,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      permission: response.permission as unknown as { [key: string]: any },
      created_date: response.created_date as string,
      updated_date: response.updated_date as string,
    }
  }
}
