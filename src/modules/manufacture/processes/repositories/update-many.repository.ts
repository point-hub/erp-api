import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateManyProcessOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateManyProcessRepository {
  handle(filter: IDocument, document: IDocument): Promise<IUpdateManyProcessOutput>
}

export class UpdateManyProcessRepository implements IUpdateManyProcessRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(filter: IDocument, document: IDocument): Promise<IUpdateManyProcessOutput> {
    return await this.database.collection(collectionName).updateMany(filter, document, this.options)
  }
}
