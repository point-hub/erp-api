import type { IDatabase, IDocument, IUpdateManyOutput, IUpdateManyRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IUpdateManyAllocationOutput extends IUpdateManyOutput {}
export interface IUpdateManyAllocationRepository extends IUpdateManyRepository {
  handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManyAllocationOutput>
}

export class UpdateManyAllocationRepository implements IUpdateManyAllocationRepository {
  constructor(public database: IDatabase) {}

  async handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManyAllocationOutput> {
    return await this.database.collection(collectionName).updateMany(filter, document, options)
  }
}
