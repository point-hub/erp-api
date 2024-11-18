import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateManyMachineOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateManyMachineRepository {
  handle(filter: IDocument, document: IDocument): Promise<IUpdateManyMachineOutput>
}

export class UpdateManyMachineRepository implements IUpdateManyMachineRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(filter: IDocument, document: IDocument): Promise<IUpdateManyMachineOutput> {
    return await this.database.collection(collectionName).updateMany(filter, document, this.options)
  }
}
