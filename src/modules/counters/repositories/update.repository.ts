import type { IDatabase, IDocument, IUpdateOutput, IUpdateRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IUpdateCounterOutput extends IUpdateOutput {}
export interface IUpdateCounterRepository extends IUpdateRepository {
  handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateCounterOutput>
}

export class UpdateCounterRepository implements IUpdateCounterRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateCounterOutput> {
    return await this.database.collection(collectionName).update(_id, document, options)
  }
}
