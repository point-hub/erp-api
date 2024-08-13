import type { ICreateOutput, ICreateRepository, IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ICreateAllocationOutput extends ICreateOutput {}
export interface ICreateAllocationRepository extends ICreateRepository {
  handle(document: IDocument, options?: unknown): Promise<ICreateAllocationOutput>
}

export class CreateAllocationRepository implements ICreateAllocationRepository {
  constructor(public database: IDatabase) {}

  async handle(document: IDocument, options?: unknown): Promise<ICreateAllocationOutput> {
    return await this.database.collection(collectionName).create(document, options)
  }
}
