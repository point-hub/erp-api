import type { IDatabase, IDocument, IUpdateManyOutput, IUpdateManyRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IUpdateManyBranchOutput extends IUpdateManyOutput {}
export interface IUpdateManyBranchRepository extends IUpdateManyRepository {
  handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManyBranchOutput>
}

export class UpdateManyBranchRepository implements IUpdateManyBranchRepository {
  constructor(public database: IDatabase) {}

  async handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManyBranchOutput> {
    return await this.database.collection(collectionName).updateMany(filter, document, options)
  }
}
