import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateAllocationOutput {
  inserted_id: string
}

export interface ICreateAllocationRepository {
  handle(document: IDocument): Promise<ICreateAllocationOutput>
}

export class CreateAllocationRepository implements ICreateAllocationRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(document: IDocument): Promise<ICreateAllocationOutput> {
    return await this.database.collection(collectionName).create(document, this.options)
  }
}
