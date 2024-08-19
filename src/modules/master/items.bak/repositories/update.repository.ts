import type { IDatabase, IDocument, IUpdateOutput, IUpdateRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IUpdateItemOutput extends IUpdateOutput {}
export interface IUpdateItemRepository extends IUpdateRepository {
  handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateItemOutput>
}

export class UpdateItemRepository implements IUpdateItemRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateItemOutput> {
    return await this.database.collection(collectionName).update(_id, document, options)
  }
}
