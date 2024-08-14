import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IRetrieveMachineOutput {
  _id: string
  code: string
  name: string
  notes: string
  created_date: string
  updated_date: string
}
export interface IRetrieveMachineRepository {
  handle(_id: string, options?: unknown): Promise<IRetrieveMachineOutput>
}

export class RetrieveMachineRepository implements IRetrieveMachineRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, options?: unknown): Promise<IRetrieveMachineOutput> {
    const response = await this.database.collection(collectionName).retrieve(_id, options)
    return {
      _id: response._id,
      code: response.code as string,
      name: response.name as string,
      notes: response.notes as string,
      created_date: response.created_date as string,
      updated_date: response.updated_date as string,
    }
  }
}
