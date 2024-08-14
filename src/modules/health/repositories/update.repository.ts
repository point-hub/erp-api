import type { IDatabase, IDocument, IUpdateOutput, IUpdateRepository } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IUpdateHealthOutput extends IUpdateOutput {}
export interface IUpdateHealthRepository extends IUpdateRepository {
  handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateHealthOutput>
}

export class UpdateHealthRepository implements IUpdateHealthRepository {
  constructor(public database: IDatabase) {}

  async handle(_id: string, document: IDocument, options?: unknown): Promise<IUpdateHealthOutput> {
    return await this.database.collection(collectionName).update(_id, document, options)
  }
}
