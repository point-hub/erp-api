import type { ICreateOutput, ICreateRepository, IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ICreateCounterOutput extends ICreateOutput {}
export interface ICreateCounterRepository extends ICreateRepository {
  handle(document: IDocument, options?: unknown): Promise<ICreateCounterOutput>
}

export class CreateCounterRepository implements ICreateCounterRepository {
  constructor(public database: IDatabase) {}

  async handle(document: IDocument, options?: unknown): Promise<ICreateCounterOutput> {
    return await this.database.collection(collectionName).create(document, options)
  }
}
