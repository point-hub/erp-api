import type { IDatabase, IDocument, IUpdateManyOutput, IUpdateManyRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IUpdateManyCounterOutput extends IUpdateManyOutput {}
export interface IUpdateManyCounterRepository extends IUpdateManyRepository {
  handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManyCounterOutput>
}

export class UpdateManyCounterRepository implements IUpdateManyCounterRepository {
  constructor(public database: IDatabase) {}

  async handle(filter: IDocument, document: IDocument, options?: unknown): Promise<IUpdateManyCounterOutput> {
    return await this.database.collection(collectionName).updateMany(filter, document, options)
  }
}
