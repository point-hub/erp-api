import type { IDatabase, IRetrieveOutput, IRetrieveRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IRetrievePermissionOutput extends IRetrieveOutput {
  code: string
  name: string
  address: string
  phone: string
  created_date: string
  updated_date: string
}
export interface IRetrievePermissionRepository extends IRetrieveRepository {
  handle(_id: string, options?: unknown): Promise<IRetrievePermissionOutput>
}

export class RetrievePermissionRepository implements IRetrievePermissionRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, options?: unknown): Promise<IRetrievePermissionOutput> {
    const response = await this.database.collection(collectionName).retrieve(_id, options)
    return {
      _id: response._id,
      code: response.code as string,
      name: response.name as string,
      address: response.address as string,
      phone: response.phone as string,
      created_date: response.created_date as string,
      updated_date: response.updated_date as string,
    }
  }
}
