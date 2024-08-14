import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteManyMachineOutput {
  deleted_count: number
}
export interface IDeleteManyMachineRepository {
  handle(_ids: string[], options?: unknown): Promise<IDeleteManyMachineOutput>
}

export class DeleteManyMachineRepository implements IDeleteManyMachineRepository {
  constructor(public database: IDatabase) {}

  async handle(ids: string[], options?: unknown): Promise<IDeleteManyMachineOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, options)
  }
}
