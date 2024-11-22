import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateItemOutput {
  inserted_id: string
}
export interface ICreateItemRepository {
  handle(document: IDocument): Promise<ICreateItemOutput>
}

export class CreateItemRepository implements ICreateItemRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(document: IDocument): Promise<ICreateItemOutput> {
    return await this.database.collection(collectionName).create(document, this.options)
  }
}
