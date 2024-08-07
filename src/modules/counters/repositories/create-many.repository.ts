import type { ICreateManyOutput, ICreateManyRepository, IDatabase, IDocument } from '@point-hub/papi'

import { collectionName } from '../entity'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ICreateManyCounterOutput extends ICreateManyOutput {}
export interface ICreateManyCounterRepository extends ICreateManyRepository {
  handle(documents: IDocument[], options?: unknown): Promise<ICreateManyCounterOutput>
}

export class CreateManyRepository implements ICreateManyCounterRepository {
  constructor(public database: IDatabase) {}

  async handle(documents: IDocument[], options?: unknown): Promise<ICreateManyCounterOutput> {
    return await this.database.collection(collectionName).createMany(documents, options)
  }
}
