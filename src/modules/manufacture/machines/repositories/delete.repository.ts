import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteMachineOutput {
  deleted_count: number
}
export interface IDeleteMachineRepository {
  handle(_id: string, options?: unknown): Promise<IDeleteMachineOutput>
}

export class DeleteMachineRepository implements IDeleteMachineRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, options?: unknown): Promise<IDeleteMachineOutput> {
    return await this.database.collection(collectionName).delete(_id, options)
  }
}
