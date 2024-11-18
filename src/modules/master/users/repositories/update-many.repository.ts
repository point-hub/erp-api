import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateManyUserOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateManyUserRepository {
  handle(filter: IDocument, document: IDocument): Promise<IUpdateManyUserOutput>
}

export class UpdateManyUserRepository implements IUpdateManyUserRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(filter: IDocument, document: IDocument): Promise<IUpdateManyUserOutput> {
    return await this.database.collection(collectionName).updateMany(filter, document, this.options)
  }
}
