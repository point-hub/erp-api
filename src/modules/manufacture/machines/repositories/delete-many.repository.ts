import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteManyMachineOutput {
  deleted_count: number
}
export interface IDeleteManyMachineRepository {
  handle(_ids: string[]): Promise<IDeleteManyMachineOutput>
}

export class DeleteManyMachineRepository implements IDeleteManyMachineRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(ids: string[]): Promise<IDeleteManyMachineOutput> {
    return await this.database.collection(collectionName).deleteMany(ids, this.options)
  }
}
