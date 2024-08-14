import type { ICreateOutput, ICreateRepository, IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ICreateHealthOutput extends ICreateOutput {}
export interface ICreateHealthRepository extends ICreateRepository {
  handle(document: IDocument, options?: unknown): Promise<ICreateHealthOutput>
}

export class CreateHealthRepository implements ICreateHealthRepository {
  constructor(public database: IDatabase) {}

  async handle(document: IDocument, options?: unknown): Promise<ICreateHealthOutput> {
    return await this.database.collection(collectionName).create(document, options)
  }
}
