import type { ICreateManyOutput, ICreateManyRepository, IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ICreateManyItemOutput extends ICreateManyOutput {}
export interface ICreateManyItemRepository extends ICreateManyRepository {
  handle(documents: IDocument[], options?: unknown): Promise<ICreateManyItemOutput>
}

export class CreateManyItemRepository implements ICreateManyItemRepository {
  constructor(public database: IDatabase) {}

  async handle(documents: IDocument[], options?: unknown): Promise<ICreateManyItemOutput> {
    return await this.database.collection(collectionName).createMany(documents, options)
  }
}
