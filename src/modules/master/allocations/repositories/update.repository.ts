import type { IDatabase, IDocument, IUpdateOutput, IUpdateRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IUpdateAllocationOutput extends IUpdateOutput {}
export interface IUpdateAllocationRepository extends IUpdateRepository {
  handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateAllocationOutput>
}

export class UpdateAllocationRepository implements IUpdateAllocationRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateAllocationOutput> {
    return await this.database.collection(collectionName).update(_id, document, options)
  }
}
