import type { IDatabase, IDocument, IUpdateOutput, IUpdateRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IUpdateBranchOutput extends IUpdateOutput {}
export interface IUpdateBranchRepository extends IUpdateRepository {
  handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateBranchOutput>
}

export class UpdateBranchRepository implements IUpdateBranchRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateBranchOutput> {
    return await this.database.collection(collectionName).update(_id, document, options)
  }
}
