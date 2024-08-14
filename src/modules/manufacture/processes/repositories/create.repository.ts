import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateProcessOutput {
  inserted_id: string
}
export interface ICreateProcessRepository {
  handle(document: IDocument, options?: unknown): Promise<ICreateProcessOutput>
}

export class CreateProcessRepository implements ICreateProcessRepository {
  constructor(public database: IDatabase) {}

  async handle(document: IDocument, options?: unknown): Promise<ICreateProcessOutput> {
    return await this.database.collection(collectionName).create(document, options)
  }
}
