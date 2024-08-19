import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateAllocationOutput {
  inserted_id: string
}
export interface ICreateAllocationRepository {
  handle(document: IDocument, options?: unknown): Promise<ICreateAllocationOutput>
}

export class CreateAllocationRepository implements ICreateAllocationRepository {
  constructor(public database: IDatabase) {}

  async handle(document: IDocument, options?: unknown): Promise<ICreateAllocationOutput> {
    return await this.database.collection(collectionName).create(document, options)
  }
}
