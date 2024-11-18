import type { IDatabase } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IDeleteMachineOutput {
  deleted_count: number
}
export interface IDeleteMachineRepository {
  handle(_id: string): Promise<IDeleteMachineOutput>
}

export class DeleteMachineRepository implements IDeleteMachineRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string): Promise<IDeleteMachineOutput> {
    return await this.database.collection(collectionName).delete(_id, this.options)
  }
}
