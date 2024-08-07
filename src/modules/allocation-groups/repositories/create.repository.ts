import type { ICreateOutput, ICreateRepository, IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ICreateAllocationGroupOutput extends ICreateOutput {}
export interface ICreateAllocationGroupRepository extends ICreateRepository {
  handle(document: IDocument, options?: unknown): Promise<ICreateAllocationGroupOutput>
}

export class CreateRepository implements ICreateAllocationGroupRepository {
  constructor(public database: IDatabase) {}

  async handle(document: IDocument, options?: unknown): Promise<ICreateAllocationGroupOutput> {
    return await this.database.collection(collectionName).create(document, options)
  }
}
