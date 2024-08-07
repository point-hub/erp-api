import type { IDatabase, IDocument, IUpdateManyOutput, IUpdateManyRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IUpdateManyAllocationGroupOutput extends IUpdateManyOutput {}
export interface IUpdateManyAllocationGroupRepository extends IUpdateManyRepository {
  handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManyAllocationGroupOutput>
}

export class UpdateManyRepository implements IUpdateManyAllocationGroupRepository {
  constructor(public database: IDatabase) {}

  async handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManyAllocationGroupOutput> {
    return await this.database.collection(collectionName).updateMany(filter, document, options)
  }
}
