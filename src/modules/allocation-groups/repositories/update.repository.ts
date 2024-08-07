import type { IDatabase, IDocument, IUpdateOutput, IUpdateRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IUpdateAllocationGroupOutput extends IUpdateOutput {}
export interface IUpdateAllocationGroupRepository extends IUpdateRepository {
  handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateAllocationGroupOutput>
}

export class UpdateRepository implements IUpdateAllocationGroupRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateAllocationGroupOutput> {
    return await this.database.collection(collectionName).update(_id, document, options)
  }
}
