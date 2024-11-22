import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateAllocationGroupOutput {
  inserted_id: string
}

export interface ICreateAllocationGroupRepository {
  handle(document: IDocument): Promise<ICreateAllocationGroupOutput>
}

export class CreateAllocationGroupRepository implements ICreateAllocationGroupRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(document: IDocument): Promise<ICreateAllocationGroupOutput> {
    return await this.database.collection(collectionName).create(document, this.options)
  }
}
