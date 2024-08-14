import type { ICreateManyOutput, ICreateManyRepository, IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ICreateManyHealthOutput extends ICreateManyOutput {}
export interface ICreateManyHealthRepository extends ICreateManyRepository {
  handle(documents: IDocument[], options?: unknown): Promise<ICreateManyHealthOutput>
}

export class CreateManyHealthRepository implements ICreateManyHealthRepository {
  constructor(public database: IDatabase) {}

  async handle(documents: IDocument[], options?: unknown): Promise<ICreateManyHealthOutput> {
    return await this.database.collection(collectionName).createMany(documents, options)
  }
}
