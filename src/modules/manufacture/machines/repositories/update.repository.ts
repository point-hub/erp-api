import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateMachineOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateMachineRepository {
  handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateMachineOutput>
}

export class UpdateMachineRepository implements IUpdateMachineRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateMachineOutput> {
    return await this.database.collection(collectionName).update(_id, document, options)
  }
}
