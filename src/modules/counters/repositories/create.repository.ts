import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateCounterOutput {
  inserted_id: string
}

export interface ICreateCounterRepository {
  handle(document: IDocument): Promise<ICreateCounterOutput>
}

export class CreateCounterRepository implements ICreateCounterRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(document: IDocument): Promise<ICreateCounterOutput> {
    return await this.database.collection(collectionName).create(document, this.options)
  }
}
