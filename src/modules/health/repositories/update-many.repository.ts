import type { IDatabase, IDocument, IUpdateManyOutput, IUpdateManyRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IUpdateManyHealthOutput extends IUpdateManyOutput {}
export interface IUpdateManyHealthRepository extends IUpdateManyRepository {
  handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManyHealthOutput>
}

export class UpdateManyHealthRepository implements IUpdateManyHealthRepository {
  constructor(public database: IDatabase) {}

  async handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManyHealthOutput> {
    return await this.database.collection(collectionName).updateMany(filter, document, options)
  }
}
