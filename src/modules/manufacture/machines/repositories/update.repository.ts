import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateMachineOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateMachineRepository {
  handle(_id: string, document: IDocument): Promise<IUpdateMachineOutput>
}

export class UpdateMachineRepository implements IUpdateMachineRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(_id: string, document: IDocument): Promise<IUpdateMachineOutput> {
    return await this.database.collection(collectionName).update(_id, { $set: document }, this.options)
  }
}
