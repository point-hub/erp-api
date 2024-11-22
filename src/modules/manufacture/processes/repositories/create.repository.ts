import type { IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

export interface ICreateProcessOutput {
  inserted_id: string
}
export interface ICreateProcessRepository {
  handle(document: IDocument): Promise<ICreateProcessOutput>
}

export class CreateProcessRepository implements ICreateProcessRepository {
  constructor(
    public database: IDatabase,
    public options?: Record<string, unknown>,
  ) {}

  async handle(document: IDocument): Promise<ICreateProcessOutput> {
    return await this.database.collection(collectionName).create(document, this.options)
  }
}
