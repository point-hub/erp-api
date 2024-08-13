import type { ICreateManyOutput, ICreateManyRepository, IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ICreateManyAllocationOutput extends ICreateManyOutput {}
export interface ICreateManyAllocationRepository extends ICreateManyRepository {
  handle(documents: IDocument[], options?: unknown): Promise<ICreateManyAllocationOutput>
}

export class CreateManyAllocationRepository implements ICreateManyAllocationRepository {
  constructor(public database: IDatabase) {}

  async handle(documents: IDocument[], options?: unknown): Promise<ICreateManyAllocationOutput> {
    return await this.database.collection(collectionName).createMany(documents, options)
  }
}
