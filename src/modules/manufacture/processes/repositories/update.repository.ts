import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface IUpdateProcessOutput {
  matched_count: number
  modified_count: number
}
export interface IUpdateProcessRepository {
  handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateProcessOutput>
}

export class UpdateProcessRepository implements IUpdateProcessRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateProcessOutput> {
    return await this.database.collection(collectionName).update(_id, document, options)
  }
}
